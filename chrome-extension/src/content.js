// chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
// });
(async () => {
    const toTimeString = time => {
        return `${Math.floor(time / 60000)}:${String(Math.floor(time / 1000) % 60).length === 1 ? '0' : ''}${Math.floor(time / 1000) % 60}`;
    };

    const timeAgo = time => {
        const gap = new Date().getTime() - new Date(time).getTime();
        if (gap < 1000 * 1) {
            return `방금전`;
        }
        if (gap < 1000 * 60) {
            return `${Math.floor(gap / 1000)}초전`;
        }
        if (gap < 1000 * 60 * 60) {
            return `${Math.floor(gap / 1000 / 60)}분전`;
        }

        if (gap < 1000 * 60 * 60 * 24) {
            return `${Math.floor(gap / 1000 / 60 / 60)}시간전`;
        }

        if (gap < 1000 * 60 * 60 * 24 * 30) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24)}일전`;
        }

        if (gap < 1000 * 60 * 60 * 24 * 30 * 365) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24 / 30)}개월전`;
        }

        if (gap >= 1000 * 60 * 60 * 24 * 30 * 365) {
            return `${Math.floor(gap / 1000 / 60 / 60 / 24 / 30 / 365)}년전`;
        }
    };

    const map = (n, start1, stop1, start2, stop2) => {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    };

    const getLocalStorage = (name, init, type) => {
        const temp = localStorage.getItem(name);
        console.log(name, temp);
        if (temp === null || temp === undefined) {
            return init;
        }
        if (type === 'number' && isNaN(Number(temp))) {
            return init;
        }
        return temp;
    };

    const saveStorage = () => {
        chrome.storage.sync.set({
            'miniple-show-comment': showComment,
            'miniple-videos-start': videosStart,
            'miniple-videos-sort-type': videosSortType,
        });
    };

    const getStorage = (key) => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(key, items => {
                console.log(key, items[key]);
                resolve(items[key])
            });
        });
    };

    const ApiDomain = 'https://miniple.xyz';
    // const ApiDomain = 'http://localhost:8000';

    let userId = (await getStorage('miniple-user-id'));
    if (!userId) {
        userId = 'anonymous:' + new Date().getTime() + ':' + Math.random();
        chrome.storage.sync.set({ 'miniple-user-id': userId });
    }

    let comments = [];

    let showComment = (await getStorage('miniple-show-comment')) === false ? false : true;
    let videoId;

    let video;
    let $video;

    let container;
    let $container;

    window.onload = () => {
        $(document).ready(() => {
            $('ytd-video-primary-info-renderer #container.ytd-video-primary-info-renderer')
            setInterval(() => {
                if (location.href.indexOf('https://www.youtube.com/watch?v=') === 0) {
                    if (
                        !$('.title.style-scope.ytd-video-primary-info-renderer') ||
                        !$('#player') ||
                        !$('.title.style-scope.ytd-video-primary-info-renderer').html()
                    ) {
                        return;
                    }
                    const nextVideoId =
                        location.href.split('https://www.youtube.com/watch?v=')[1].split('&')[0];
                    if (!videoId) {
                        videoId = location.href.split('https://www.youtube.com/watch?v=')[1].split('&')[0];
                        // 비디오
                        video = $('video').get(0);
                        $video = $(video);
                        // 컨테이너
                        $container = $video.parent().parent();
                        container = $container.get(0);
                        initMiniple();
                        hideInput();
                    } else if (videoId !== nextVideoId) {
                        videoId = nextVideoId;
                        comments = [];
                        getComments();
                        getVideos();
                        getNotice();
                        hideInput();
                    }
                }
            }, 500);
        });
    };

    // 패널정보업데이트
    const updatePanel = () => {
        $('.miniple-panel .miniple-panel-item[data-type="comment-count"]')
            .html(`구름 ${comments.length}개`);

        const temp = comments
            .map(item => item)
            .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
            .slice(0, 30);

        $('.miniple-panel .miniple-panel-comment .miniple-panel-comment-frame')
            .html(temp.length === 0 ? `
            <div class="miniple-panel-comment-span">첫 구름을 달아보세요!</div>
        ` : '')
            .append(`
            ${temp.map(comment => `
            <div class="miniple-panel-comment-item" data-time="${comment.time}">
                <div class="miniple-create-time">${timeAgo(comment.createTime)}</div>
                <div class="miniple-time">${toTimeString(comment.time)}</div>
                <div class="miniple-text">${comment.text}</div>
            </div>`).join('')}`);
    };

    // 팝업 보이기
    let showPopupCallCount = 0;
    const showPopup = (text) => {
        const $th = $('#miniple-popup');
        if (!$th) {
            return;
        }
        $th.css('opacity', 1);
        $th.html(text);
        const pk = ++showPopupCallCount;
        setTimeout(() => {
            if (pk === showPopupCallCount) {
                $th.css('opacity', 0);
            }
        }, 1500);
    };

    // 코멘트 로드
    // 구름아트 가능하게 좌표로직
    // 등록시간으로 부터 2초동안 보임
    const getComments = () => {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await $.ajax({

                    method: 'get',
                    dataType: 'json',
                    url: ApiDomain + '/comments?videoId=' + videoId
                });
                comments = res;
                updatePanel();
                resolve(res);
            } catch (e) {
                showPopup(`구름불러오기 실패`);
                reject(e);
            }
        });
    };

    const writeComment = (text, time, x, y) => {
        return new Promise(async (resolve, reject) => {
            try {
                const data = { videoId, text, time, x, y, userId };
                const res = await $.ajax({
                    method: 'post',
                    dataType: 'json',
                    url: ApiDomain + '/comment',
                    data
                });
                comments = res.comments;
                showPopup(`${toTimeString(time)}에 구름을 달았습니다.`);
                updatePanel();
                resolve(res);
            } catch (e) {
                showPopup(`구름작성 실패`);
                reject(e);
            }
        });
    };

    // 영상정보가져오기
    let videosSortType = await getStorage('miniple-videos-sort-type');
    let videosStart = await getStorage('miniple-videos-start');
    let videosLimit = 7;
    if (['recentComment', 'commentWriterCount'].indexOf(videosSortType) === -1) {
        videosSortType = 'commentWriterCount';
    }
    if (typeof videosStart !== 'number' || !videosStart) {
        videosStart = 0;
    }
    let getNoticeCallCount = 0;
    const getNotice = async () => {
        const pk = ++getNoticeCallCount;
        const res = await $.ajax({
            method: 'get',
            dataType: 'json',
            url: ApiDomain + `/board/list`
        });
        if (pk === getNoticeCallCount && res[0]) {
            $('.miniple-notice-wrap').css('display', 'block');
            $('.miniple-notice-wrap').html(`${res[0].title}`);
        }
    };
    let getVideosCallCount = 0;
    const getVideos = async () => {
        try {
            saveStorage();
            const pk = ++getVideosCallCount;
            $('.miniple-videos-wrap').html(`
            <div style="text-align: center; margin-top: 10px;">
                데이터 불러오는 중...
            </div>
            `);
            const res = await $.ajax({
                method: 'get',
                dataType: 'json',
                url: ApiDomain + `/videos?sortType=${videosSortType}&start=${videosStart}&limit=${videosLimit}`
            });
            if (pk === getVideosCallCount) {
                const list = res.list;
                const allCount = res.allCount;
                $('.miniple-videos-wrap').html(`
                    <div class="miniple-page-nation"></div>
                    ${list.map(video => `
                    <a class="miniple-video" href="/watch?v=${video.id}" title="${video.title}">
                        <div class="miniple-thumbnail"
                            style="background-image: url(${video.thumbnailSrc});">
                        </div>
                        <div class="miniple-content">
                            <div class="miniple-title miniple-ellipsis">${video.title}</div>
                            <div class="miniple-sub">
                                <div>
                                    <div class="miniple-comment miniple-ellipsis">
                                        <marquee direction="left" scrollamount="2">${video.recentCommentText}</marquee>
                                    </div>
                                </div>
                                <div style="padding-right: 8px; margin-right: 8px; border-right: 1px solid #ddd;">${timeAgo(video.recentCommentCreateTime)}</div>
                                <div style="padding-right: 8px; margin-right: 8px; border-right: 1px solid #ddd;"><i class="far fa-comment"></i> ${video.commentCount}</div>
                                <div><i class="far fa-user"></i> ${video.commentWriterCount}</div>
                            </div>
                        </div>
                    </a>`).join('')}
                `);
                let pageNationHtml = '';
                let pageNationStart, pageNationEnd;
                if (Math.floor(videosStart / videosLimit) < 5) {
                    pageNationStart = 0;
                    pageNationEnd = Math.min(Math.floor(allCount / videosLimit), 8);
                } else {
                    pageNationStart = Math.floor(videosStart / videosLimit) - 4;
                    pageNationEnd = Math.min(Math.floor(allCount / videosLimit), pageNationStart + 8);
                }
                for (let i = pageNationStart; i <= pageNationEnd; i++) {
                    pageNationHtml += `<div class="miniple-page-nation-item ${Math.floor(videosStart / videosLimit) === i ? 'miniple-active' : ''}" data-start="${i * videosLimit}">${i + 1}</div>`;
                }
                $('.miniple-videos-wrap .miniple-page-nation').html(pageNationHtml);
            }
        } catch (e) {
            console.log(e);
        }
    };

    const inputWidth = 500000;
    const inputHeight = 500000;


    // 캔버스
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 캔버스 컨테이너
    const canvasContainer = document.createElement('div');
    canvasContainer.style.position = 'absolute';
    canvasContainer.style.zIndex = '10';
    canvasContainer.style.top = '0';
    canvasContainer.style.left = '0';
    canvasContainer.style.overflow = 'hidden';

    // 팝업
    const popupWrapper = document.createElement('div');
    const popup = document.createElement('div');
    popup.setAttribute('id', 'miniple-popup');
    popupWrapper.setAttribute('style', `
    position: absolute;
    z-index: 9;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
`);
    popup.setAttribute('style', `
    max-width: 350px;
    width: 100%;
    background: rgba(255, 255, 255, .85);
    color: #000;
    border-radius: 10px;
    padding: 20px;
    box-sizing: border-box;
    font-family: Arial;
    whiet-space: pre-wrap;
    opacity: 0;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
    transition: opacity .5s;
`);
    popupWrapper.appendChild(popup);

    // 댓글 컨테이너
    const inputContainer = document.createElement('div');
    inputContainer.style.position = 'absolute';
    inputContainer.style.zIndex = '11';
    inputContainer.style.top = '0';
    inputContainer.style.left = '0';
    inputContainer.style.width = '100%';
    inputContainer.style.height = '100%';
    inputContainer.style.overflow = 'hidden';

    const inputArea = document.createElement('div');
    inputArea.style.position = 'absolute';
    inputArea.style.top = '0';
    inputArea.style.left = '0';
    inputArea.style.width = '100%';
    inputArea.style.height = '100%';
    inputArea.style.cursor = 'text';

    const inputVirtual = document.createElement('span');
    inputVirtual.setAttribute('class', 'miniple-input-virtual');

    // 댓글작성
    inputArea.onmousedown = e => e.stopPropagation();
    inputArea.onmouseup = e => e.stopPropagation();
    inputArea.onclick = (e) => {
        if (input.style.display !== 'inline-block') {
            input.style.display = 'inline-block';
            input.style.top = `${e.layerY - 14}px`;
            input.style.left = `${e.layerX}px`;
            writeTime = video.currentTime * 1000;
            showPopup(`${toTimeString(writeTime)}에 구름을 작성합니다.<br/><span style="color: #888;">Enter:작성 | Esc:취소</span>`);
            input.focus();
        } else {
            writeComment2();
            hideInput();
        }
    };

    // 댓글입력창
    let writeTime;
    const input = document.createElement('input');
    // input.setAttribute('placeholder', 'Enter키 누르면 작성');
    input.setAttribute('class', 'miniple-input');
    input.setAttribute('maxlength', '100');

    input.onclick = e => e.stopPropagation();
    input.onkeydown = e => {
        e.stopPropagation();
        if (e.keyCode === 27) {
            hideInput();
        }
        resizeInput();
    };
    input.onkeyup = e => {
        resizeInput();
    };
    input.onkeypress = e => {
        e.stopPropagation();
        if (e.keyCode === 13 && input.value) {
            writeComment2();
        }
    };

    const resizeInput = () => {
        inputVirtual.innerText = input.value;
        input.style.width = (inputVirtual.clientWidth + 26) + 'px';
    };

    const hideInput = () => {
        writeTime = null;
        input.value = '';
        input.style.display = 'none';
        resizeInput();
    };

    // 댓글입력
    const writeComment2 = () => {
        if (!input.value) {
            return;
        }
        if (!showComment) {
            showPopup('구름이 비활성화 상태입니다.');
            return;
        }
        writeComment(
            input.value,
            writeTime,
            map(Number(input.style.left.replace('px', '')) + 4, 0, canvas.width, 0, inputWidth),
            map(Number(input.style.top.replace('px', '')) + 10, 0, canvas.height, 0, inputHeight)
        );
        hideInput();
    };


    const initMiniple = () => {
        $container.attr('is-init-miniple', 'true');

        // 영상
        $('#related.ytd-watch-flexy')
            .prepend(`
        <div class="miniple-sidebar">
            <div class="miniple-videos-tabs">
                <div class="miniple-videos-tab miniple-card" data-sort-type="recentComment">최신영상</div>
                <div class="miniple-videos-tab miniple-card" data-sort-type="commentWriterCount">인기영상</div>
            </div>
            <div class="miniple-videos-wrap"></div>
        </div>`);
        $('.miniple-videos-tab[data-sort-type="' + videosSortType + '"]').addClass('miniple-active');
        $(document).on("click", ".miniple-videos-tab", function () {
            if (!$(this).hasClass('miniple-active')) {
                videosStart = 0;
            }
            $('.miniple-videos-tab').removeClass('miniple-active');
            videosSortType = $(this).attr('data-sort-type');
            $(this).addClass('miniple-active');
            getVideos();
        });
        $(document).on("click", ".miniple-videos-wrap .miniple-page-nation-item", function () {
            videosStart = Number($(this).attr('data-start'));
            getVideos();
        });

        // 패널정보
        // $('ytd-video-primary-info-renderer #container.ytd-video-primary-info-renderer')
        $('#related.ytd-watch-flexy')
            .prepend(`
        <div class="miniple-panel">
            <div class="miniple-notice-wrap miniple-card" style="display: none;"></div>
            <div class="miniple-title-wrap miniple-card">
                <div class="miniple-panel-item">
                    <button class="miniple-show-comment-toggle"></button>
                </div>
                <div class="miniple-panel-item" data-type="comment-count"></div>
            </div>
            <div class="miniple-panel-comment miniple-card">
                <div class="miniple-panel-comment-container">
                    <div class="miniple-panel-comment-frame"></div>
                    <!-- <div class="miniple-panel-comment-close"></div> -->
                </div>
            </div>
        </div>`);
        $(document).on("click", ".miniple-panel-comment", function () {
            $(this).toggleClass('miniple-active');
            $(this).find('.miniple-panel-comment-frame').scrollTop(0);
        });
        $(document).on("click", ".miniple-panel-comment-item", function () {
            video.currentTime = Number(($(this).attr('data-time') / 1000));
        });
        $(document).on("click", ".miniple-panel-comment-close", function () {
            $('miniple-panel-comment').removeClass('miniple-active');
        });

        // 구름 켜기/끄기
        $(document).on("click", ".miniple-show-comment-toggle", function () {
            showComment = !showComment;
            saveStorage();
            if (showComment) {
                showPopup('구름 활성화');
            } else {
                showPopup('구름 비활성화');
            }
            $('.miniple-show-comment-toggle').toggleClass('miniple-active', showComment);
        });
        $('.miniple-show-comment-toggle').toggleClass('miniple-active', showComment);

        // 로그인
        $('#related.ytd-watch-flexy')
            .prepend(``)

        // 캔버스 컨테이너
        inputContainer.appendChild(inputArea);
        inputContainer.appendChild(inputVirtual);
        inputContainer.appendChild(input);
        canvasContainer.appendChild(popupWrapper);
        canvasContainer.appendChild(canvas);
        container.appendChild(canvasContainer);
        container.appendChild(inputContainer);

        // 캔버스크기 조절
        const resize = () => {
            if (
                $video.width() !== canvas.width ||
                $video.height() !== canvas.height
            ) {
                canvas.width = $video.width();
                canvas.height = $video.height();

                canvasContainer.style.width = $video.css('width');
                canvasContainer.style.height = $video.css('height');
                canvasContainer.style.top = $video.css('top');
                canvasContainer.style.left = $video.css('left');
            }
        };

        const render = () => {
            const currentTime = video.currentTime * 1000;
            const commentsForRender = comments.filter(comment => currentTime - 4000 <= comment.time && comment.time <= currentTime);
            comments.forEach(comment => [
                console.log(currentTime, comment.time)
            ]);

            ctx.clearRect(-100, -100, 10000, 10000);
            if (!showComment) {
                return;
            }
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#fff';
            // if (canvas.width < 500) {
            // ctx.font = `bold 12px 맑은고딕`;
            // } else {
            ctx.font = `bold 16px 맑은고딕`;
            // }
            ctx.shadowColor = "rgba(0,0,0,0.5)";
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            commentsForRender.forEach(comment => ctx.fillText(
                comment.text,
                map(comment.x, 0, inputWidth, 0, canvas.width),
                map(comment.y, 0, inputHeight, 0, canvas.height),
            ));
        };

        resize();
        setInterval(() => resize(), 1000);
        resizeInput();

        getComments();
        getVideos();
        getNotice();
        setInterval(() => { render(); }, 100);
    };
})();
