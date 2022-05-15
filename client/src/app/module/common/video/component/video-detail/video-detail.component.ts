import { Component, OnInit, Input, ViewChild, ElementRef, AfterContentInit, Renderer, Renderer2, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../../service/api.service';
import { CoreService } from '../../../../../service/core.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_AUTOCOMPLETE_DEFAULT_OPTIONS, MatDialog } from '@angular/material/core';
import { sleep } from '../../../../../../util';
import { SignInComponent } from '../../../auth/component/sign-in/sign-in.component';
import { UserHistoryComponent } from '../../../user/component/user-history/user-history.component';
import { VideoPlayerYoutubeComponent } from '../video-player-youtube/video-player-youtube.component';
import { VideoPlayerGoogleDriveComponent } from '../video-player-google-drive/video-player-google-drive.component';

@Component({
    selector: 'app-video-detail',
    templateUrl: './video-detail.component.html',
    styleUrls: ['./video-detail.component.scss']
})
export class VideoDetailComponent implements OnInit, AfterContentInit, OnDestroy {
    @ViewChild('youtubeVideoPlayer') youtubeVideoPlayer: VideoPlayerYoutubeComponent;
    @ViewChild('googleDriveVideoPlayer') googleDriveVideoPlayer: VideoPlayerGoogleDriveComponent;
    @ViewChild('videoWrap') videoWrap: ElementRef;
    @ViewChild('commentWrap') commentWrap: ElementRef;
    @ViewChild('inputArea') inputArea: ElementRef;
    @ViewChild('input') input: ElementRef;
    @ViewChild('inputVirtual') inputVirtual: ElementRef;
    @ViewChild('canvas') canvas: ElementRef;
    @ViewChild('timelineCanvas') timelineCanvas: ElementRef;
    @ViewChild('artWrap') artWrap: ElementRef;
    @ViewChild('artCanavas') artCanavas: ElementRef;
    @ViewChild('randomCommentInput') randomCommentInput: ElementRef;
    @ViewChild('randomCommentInput2') randomCommentInput2: ElementRef;
    context: CanvasRenderingContext2D;
    artContext: CanvasRenderingContext2D;
    timelineContext: CanvasRenderingContext2D;
    isAfterContentInit = false;
    videoData: any;
    videoVolume = isNaN(Number(localStorage.getItem('miniple-video-volume'))) ? null : Number(localStorage.getItem('miniple-video-volume'));
    isMuted = !!localStorage.getItem('miniple-video-mute');

    videoWidth = 1300;
    videoHeight = 675;

    fontSize = 21;
    videoScale = 1;
    info: any;
    comments: any = [];
    commentsForChat: any = [];
    commentsForList: any = [];
    commentsForDisplayList: any = [];
    commentsForListStart = 0;
    commentsForListLimit = 20;
    commentsForTop: any = {};
    useCommentMode = true;
    currentTime: number;
    durationTime: number;
    get relativeFontSize() {
        return Math.max(11, this.fontSize * this.videoScale);
    }
    modeTypes = ['yotube', 'input', 'art'];
    _mode: string;
    get mode() {
        return this._mode;
    }
    set mode(next: string) {
        if (this.modeTypes.indexOf(next) === -1) {
            next = 'youtube';
        }
        this._mode = next;
        localStorage.setItem('miniple-mode', next);
    }
    isArtMode = false;
    artComments = [];

    intervals: any = [];
    onResize: any;

    virtualInputWidth = 1;
    virtualInputHeight = 1;

    commentTime: number = null;

    alerts: any = [];

    isRequestingLikeVideo = false;

    latestGetVideoId: string;
    getVideoCallCount = 0;

    video: any;
    resource: any;

    get player() {
        if (this.resource && this.resource.origin === "youtube") {
            return this.youtubeVideoPlayer;
        }
        if (this.resource && this.resource.origin === "googleDrive") {
            return this.googleDriveVideoPlayer;
        }
    }

    isDestroyed = false;

    _sideTabType = 'reaction';
    get sideTabType() { return this._sideTabType; }
    set sideTabType(next) {
        if (['reaction', 'live', 'recent'].indexOf(next) === -1) {
            next = 'live';
        }
        this._sideTabType = next;
        if (next === 'reaction') {
            this.commentsForListStart = 0;
            this.updateCommentsForList();
        }
        if (next === 'recent') {
            this.commentsForListStart = 0;
            this.updateCommentsForList();
        }
        if (next === 'live') {
            this.updateCommentsForChat();
        }
        localStorage.setItem('miniple-side-tab-type', next);
        try {
            setTimeout(() => {
                if (this.commentWrap && this.commentWrap.nativeElement) {
                    this.commentWrap.nativeElement.scrollTop = 1000000;
                }
            }, 10);
        } catch (e) { }
    }

    get gettedVideo() {
        return this.videoId === this.latestGetVideoId;
    }

    // 랜덤커멘트
    randomComment = {
        time: null,
        text: '',
    };
    writeRandomComment() {
        if (!this.player || !this.videoId || !this.randomComment || !this.randomComment.text || typeof this.randomComment.time !== 'number') {
            return;
        }
        this.writeComment({
            time: this.randomComment.time,
            x: this.map(Math.random(), 0, 1, 0, this.virtualInputWidth),
            y: this.map(Math.random(), 0, 1, 0, this.virtualInputHeight),
            text: this.randomComment.text,
            videoId: this.videoId
        });
        this.randomComment.text = '';
        this.randomComment.time = null;
        if (this.randomCommentInput) {
            this.randomCommentInput.nativeElement.value = '';
        }
        if (this.randomCommentInput2) {
            this.randomCommentInput2.nativeElement.value = '';
        }
    }
    setRandomCommentTime() {
        this.randomComment.time = this.player.currentTime;
        this.alert(`[텍스트박스] ${this.toTimeForDisplay(this.randomComment.time)} 구름을 작성합니다.`);
    }
    clearRandomCommentTime() {
        // this.randomComment.time = null;
    }
    onChangeRandomCommentInput(event) {
        const value = event.target.value;
        if (this.randomComment.text && !value) {
            this.randomComment.time = null;
            this.alert(`[텍스트박스] 구름작성을 취소합니다.`);
        }
        if ((typeof this.randomComment.time !== 'number') && value) {
            this.randomComment.time = this.player.currentTime;
            this.alert(`[텍스트박스] ${this.toTimeForDisplay(this.randomComment.time)} 구름을 작성합니다.`);
        }
        // if (!value) {
        //     this.alert(`[텍스트박스] ${this.toTimeForDisplay(this.randomComment.time)} 구름작성을 취소합니다.`);
        // }
        this.randomComment.text = event.target.value;
    }

    artChars = ['◆', '★'];
    activeArtChar: string;

    addArtChar() {
        let str = prompt('슬롯에 추가할 한 문자를 입력해주세요.');
        if (!str || str.split(' ').join('') === '') {
            return;
        }
        str = str.split(' ').join('').substr(0, 1);
        if (str === ',') {
            alert('금지문자입니다.');
            return;
        }
        if (this.artChars.indexOf(str) === -1) {
            this.artChars.push(str);
            localStorage.setItem('miniple-art-chars', JSON.stringify(this.artChars));
        }
    }

    removeArtChar() {
        if (!confirm(this.activeArtChar + ' 문자를 슬롯에서 제거하시겠습니까?')) {
            return;
        }
        const str = this.activeArtChar;
        const index = this.artChars.indexOf(str);
        if (index !== -1) {
            this.artChars.splice(index, 1);
            localStorage.setItem('miniple-art-chars', JSON.stringify(this.artChars));
            this.activeArtChar = this.artChars[0];
        }
    }

    constructor(public _api: ApiService, public _core: CoreService, private _renderer: Renderer, private _dialog: MatDialog) {
        this.onResize = () => {
            this.resize();
        };
        window.addEventListener('resize', this.onResize);

        if (!this._core.isLoggedIn) {
            this.mode = 'youtube';
        } else {
            this.mode = localStorage.getItem('miniple-mode');
        }

        this.sideTabType = localStorage.getItem('miniple-side-tab-type');
        try {
            const temp = localStorage.getItem('miniple-art-chars');
            if (temp) {
                this.artChars = JSON.parse(temp);
            }
        } catch (e) {
        }
        this.activeArtChar = this.artChars[0];

        window.requestAnimationFrame((timestamp: number) => this.render(timestamp));
    }

    ngOnInit() {
    }

    ngAfterContentInit() {
        this.isAfterContentInit = true;
        this.context = this.canvas.nativeElement.getContext('2d');
        this.artContext = this.artCanavas.nativeElement.getContext('2d');
        this.timelineContext = this.timelineCanvas.nativeElement.getContext('2d');
        if (this.videoId) {
            this.updateVideo();
            this.resize();
        }
    }

    ngOnDestroy() {
        this.isDestroyed = true;
        this.intervals.forEach(item => clearInterval(item));
        window.removeEventListener('resize', this.onResize);
        document.title = '미니플 - 아주 작은 UCC 플랫폼';
    }

    clearCommentInput() {
        this.commentTime = null;
        this.input.nativeElement.value = '';
        this._renderer.setElementStyle(this.input.nativeElement, 'visibility', 'hidden');
        this._renderer.setElementStyle(this.input.nativeElement, 'opacity', '0');
        this.onChangeCommentInput();
    }

    onClickCommentInputArea(e: any) {
        const input = this.input.nativeElement;
        if (input.style.visibility === '' || input.style.visibility === 'hidden') {
            this.commentTime = this.player.currentTime;
            this._renderer.setElementStyle(input, 'top', `${e.offsetY - (this.relativeFontSize / 2)}px`);
            this._renderer.setElementStyle(input, 'left', `${e.offsetX}px`);
            this._renderer.setElementStyle(input, 'visibility', 'visible');
            this._renderer.setElementStyle(input, 'opacity', '1');
            setTimeout(() => {
                input.focus();
            }, 100);
            this.alert(`${this.toTimeForDisplay(this.commentTime)} 구름을 작성합니다.`);
        } else {
            if (input.value) {
                this.onEnterCommentInput();
            } else {
                // this.alert(`${this.toTimeForDisplay(this.commentTime)} 구름작성을 취소합니다.`);
                this.clearCommentInput();
            }
        }
    }

    onClickCommentArt(e: any) {
        const ctx = this.artContext;
        if (this.artComments.length >= 500) {
            this.alert('구름아트는 총 500개의 문자까지만 찍을 수 있습니다.');
            return;
        }
        this.artComments.push({
            text: this.activeArtChar,
            x: this.map(e.offsetX - (this.relativeFontSize / 2),
                0,
                ctx.canvas.width,
                0,
                this.virtualInputWidth
            ),
            y: this.map(e.offsetY - (this.relativeFontSize / 2),
                0,
                ctx.canvas.height,
                0,
                this.virtualInputHeight
            )
        });
        this.renderArt();
    }

    onChangeCommentInput() {
        const input = this.input.nativeElement;
        const inputVirtual = this.inputVirtual.nativeElement;
        const left = Number(input.style.left.replace('px', ''));

        inputVirtual.innerText = input.value;
        const width = inputVirtual.clientWidth + this.relativeFontSize;
        this._renderer.setElementStyle(input, 'font-size', `${this.relativeFontSize}px`);
        this._renderer.setElementStyle(input, 'width', `${width}px`);
        this._renderer.setElementStyle(input, 'height', `${this.relativeFontSize}px`);
        if (width + left > this.videoWrap.nativeElement.clientWidth) {
            this._renderer.setElementStyle(input, 'left', `${this.videoWrap.nativeElement.clientWidth - width}px`);
        }
    }

    onEscCommentInput() {
        // this.alert(`${this.toTimeForDisplay(this.commentTime)} 구름작성을 취소합니다.`);
        this.clearCommentInput();
    }

    onEnterCommentInput() {
        const input = this.input.nativeElement;
        if (!input.value) {
            this.alert('구름을 입력해주세요.');
            return;
        }
        const x = this.map(
            Number(input.style.left.replace('px', '')),
            0,
            this.videoWrap.nativeElement.clientWidth,
            0,
            this.virtualInputWidth
        );
        const y = this.map(
            Number(input.style.top.replace('px', '')),
            0,
            this.videoWrap.nativeElement.clientHeight,
            0,
            this.virtualInputHeight
        );
        const text = input.value;
        const time = this.commentTime;

        // 코멘트 텍스트 초기화
        this.clearCommentInput();

        this.writeComment({
            text,
            time,
            x,
            y,
            videoId: this.videoId
        });
    }

    onClickPlayerTimeBar(e) {
        const per = e.offsetX / e.target.clientWidth;
        this.seekTo((this.durationTime / 1000) * per);
    }

    onClickVolumeGage(e) {
        const per = (1 - (e.offsetY / e.target.clientHeight)) * 100;
        this.setVolume(per);
    }

    onClickVolumeGageVr(e) {
        const per = e.offsetX / e.target.clientWidth * 100;
        this.setVolume(per);
    }

    onPlayerInit() {
        setTimeout(() => {
            if (this.isMuted) {
                this.mute();
            }
            if (this.videoVolume) {
                this.setVolume(this.videoVolume);
            }
        });
        this.renderForTimeline();
        setTimeout(() => { this.resize(); }, 500);
    }

    setVolume(volume: number) {
        if (this.player) {
            this.videoVolume = volume;
            this.player.setVolume(volume);
            localStorage.setItem('miniple-video-volume', String(volume));
        }
    }

    mute() {
        if (this.player) {
            this.isMuted = true;
            this.player.mute();
            localStorage.setItem('miniple-video-mute', '1');
        }
    }

    unMute() {
        if (this.player) {
            this.isMuted = false;
            this.player.unMute();
            localStorage.removeItem('miniple-video-mute');
        }
    }

    seekTo(time: number) {
        if (this.player) {
            this.player.seekTo(time);
        }
    }

    togglePlay() {
        this.player.togglePlay();
    }

    async likeVideo() {
        if (this.isRequestingLikeVideo) {
            return;
        }
        this.isRequestingLikeVideo = true;
        try {
            const res = await this._api.likeVideo({ videoId: this.videoId });
            this.video.isLike = res.isLike;
            this.video.likeCount = res.likeCount;
        } catch (e) { }
        this.isRequestingLikeVideo = false;
    }

    async writeArtComment() {
        let time: number;
        try {
            if (this.artComments.length === 0) {
                return;
            }
            time = this.player.currentTime;
            const res = await this._api.writeArtComment({
                time,
                videoId: this.videoId,
                info: this.artComments
            });
            this.comments.push(res);
            this.comments.sort((a, b) => a.time - b.time);
            this.updateCommentsForChat(true);
            this.updateCommentsForList();

            this.renderForTimeline();
            this.artComments = [];
            this.renderArt();
            this.alert(`${this.toTimeForDisplay(time)} 구름아트 등록에 성공했습니다.`, 'green');
        } catch (e) {
            this.alert(`${this.toTimeForDisplay(time)} 구름아트 등록에 실패했습니다.\n${e.error}`, 'red');
        }
    }

    async writeComment(data: {
        time: number;
        x: number;
        y: number;
        videoId: string;
        text: string;
    }) {
        try {
            const res = await this._api.writeComment(data);
            this.comments.push(res);
            this.comments.sort((a, b) => a.time - b.time);
            this.updateCommentsForChat(true);
            this.updateCommentsForList();
            // 
            this.renderForTimeline();
            this.alert(`${this.toTimeForDisplay(data.time)} 구름을 등록했습니다.`, 'green');
        } catch (e) {
            this.alert(`${this.toTimeForDisplay(data.time)} 구름등록을 실패했습니다.\n${e.error}`, 'red');
        }
    }

    alert(str: string, theme?: string) {
        const id = new Date().getTime() + ':' + Math.random();
        this.alerts.unshift({
            id,
            text: str,
            theme
        });
        setTimeout(() => {
            const index = this.alerts.indexOf(this.alerts.find(item => item.id === id));
            if (index !== -1) {
                this.alerts.splice(index, 1);
            }
        }, 3000);
    }

    renderForTimeline() {
        if (!this.player || !this.context || typeof this.player.currentTime !== 'number' || !this.timelineCanvas) {
            return;
        }
        const canvas = this.timelineCanvas.nativeElement;
        const ctx = this.timelineContext;
        const durationTime = this.player.durationTime;
        const lookup = {};
        let max = -Infinity;
        const period = durationTime * 0.002;
        for (let i = 0; i < this.comments.length; i++) {
            const j = Math.floor(this.comments[i].time / period) * period;
            const v = lookup[j] ? lookup[j] + 1 : 1;
            if (max < v) {
                max = v;
            }
            lookup[j] = v;
        }

        const itemWidth = this.map(period, 0, durationTime, 0, canvas.width);
        const height = canvas.height;

        ctx.clearRect(-100, -100, 10000, 10000);
        ctx.fillStyle = 'rgba(167,120,19,.85)';
        // ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
        for (let time in lookup) {
            const x = this.map(time, 0, durationTime, 0, canvas.width);
            const y = this.map(lookup[time], 0, max, canvas.height, 30);
            // ctx.moveTo(x, y);
            // ctx.lineTo(Math.floor(x - (itemWidth / 2)), height);
            // ctx.lineTo(Math.floor(x + (itemWidth / 2)), height);
            // ctx.stroke();
            // ctx.fill();
            ctx.fillRect(
                x, y,
                itemWidth,
                height
            );
        }
    }

    render(timestamp?: number) {
        if (this.isDestroyed) {
            return;
        }
        try {
            if (!this.player || !this.context || typeof this.player.currentTime !== 'number') {
                throw '';
            }
            const player = this.player;
            const canvas = this.canvas.nativeElement;
            const ctx = this.context;
            const comments = this.comments;
            const currentTime = this.currentTime = player.currentTime;
            const durationTime = this.durationTime = player.durationTime;
            const animationTime = 150;

            const map = this.map;

            const commentsForRender = comments.filter(comment => currentTime - 2000 <= comment.time && comment.time <= currentTime);

            ctx.clearRect(-100, -100, 10000, 10000);
            if (!this.useCommentMode) {
                throw null;
            }
            ctx.textBaseline = 'hanging';
            ctx.textAlign = 'left';
            ctx.font = `${this.relativeFontSize}px 맑은고딕`;
            // ctx.shadowColor = "rgba(0,0,0,1)";
            // ctx.shadowOffsetX = 0;
            // ctx.shadowOffsetY = 0;
            // ctx.shadowBlur = 10;
            ctx.lineWidth = 5;
            commentsForRender.forEach(comment => {
                const g = currentTime - comment.time;
                let opacity = 1;
                if (g <= animationTime) {
                    opacity = map(g, 0, animationTime, 0, 1);
                }
                if (g >= 2000 - animationTime) {
                    opacity = map(g, 2000 - animationTime, 2000, 1, 0);
                }
                if (comment.reactions) {
                    ctx.fillStyle = `rgba(255,215,0,${opacity})`;
                } else {
                    ctx.fillStyle = `rgba(255,255,255,${opacity})`;
                }
                ctx.strokeStyle = `rgba(0,0,0,${opacity})`;
                if (comment.artInfo) {
                    try {
                        comment.artInfo.forEach(item => {
                            ctx.strokeText(
                                item[0],
                                Math.floor(map(item[1], 0, this.virtualInputWidth, 0, canvas.width)),
                                Math.floor(map(item[2], 0, this.virtualInputHeight, 0, canvas.height)),
                            );
                            ctx.fillText(
                                item[0],
                                Math.floor(map(item[1], 0, this.virtualInputWidth, 0, canvas.width)),
                                Math.floor(map(item[2], 0, this.virtualInputHeight, 0, canvas.height)),
                            );
                        });
                    } catch (e) { }
                } else {
                    const w = ctx.measureText(comment.text).width;
                    let x = map(comment.x, 0, this.virtualInputWidth, 0, canvas.width);
                    if (w + x > canvas.width) {
                        x = canvas.width - w;
                    }
                    ctx.strokeText(
                        comment.text,
                        Math.floor(x),
                        Math.floor(map(comment.y, 0, this.virtualInputHeight, 0, canvas.height)),
                    );
                    ctx.fillText(
                        comment.text,
                        Math.floor(x),
                        Math.floor(map(comment.y, 0, this.virtualInputHeight, 0, canvas.height)),
                    );
                    if (comment.reactions) {
                        ctx.save();
                        ctx.font = `${this.relativeFontSize * 0.9}px 맑은고딕`;

                        let yg = map(g % 500, Math.floor(g / 500) % 2 === 0 ? 0 : 500, Math.floor(g / 500) % 2 === 0 ? 500 : 0, 0, 5);

                        let reactionText = '';
                        for (let type in comment.reactions) {
                            reactionText += `${this.reactionTexts[type]}${comment.reactions[type]} `;
                        }
                        ctx.strokeText(
                            reactionText,
                            Math.floor(x),
                            Math.floor(map(comment.y, 0, this.virtualInputHeight, 0, canvas.height) - this.relativeFontSize - yg),
                        );
                        ctx.fillText(
                            reactionText,
                            Math.floor(x),
                            Math.floor(map(comment.y, 0, this.virtualInputHeight, 0, canvas.height) - this.relativeFontSize - yg),
                        );
                        ctx.restore();
                    }
                }
            });

            this.updateCommentsForChat();

            // if (this.player) {
            // this.isMuted = this.player.isMuted;
            // if (this.resource && this.resource.origin === 'youtube'){
            //     this.videoVolume = this.player.volume;
            // }
            // }
        } catch (e) { }
        window.requestAnimationFrame((timestamp: number) => this.render(timestamp));
    }

    reactionTexts = {
        'funny': '🤣',
        'bad': '😡',
        'surprise': '😱',
        'sad': '😭',
    }

    updateCommentsForList() {
        const arr = [...this.comments];
        if (this.sideTabType === 'reaction') {
            arr.sort((a, b) => b.id - a.id);
            arr.sort((a, b) => b.reactionCount - a.reactionCount);
            console.log(arr);
        }
        if (this.sideTabType === 'recent') {
            arr.sort((a, b) => b.id - a.id);
        }
        this.commentsForList = arr;
        this.updateCommentsForDisplayList();
    }

    updateCommentsForDisplayList() {
        this.commentsForDisplayList = this.commentsForList.slice(this.commentsForListStart, this.commentsForListStart + this.commentsForListLimit);
    }

    updateCommentsForChat(willUpdate?) {
        if (!this.player || !this.context || typeof this.player.currentTime !== 'number' || !this.commentWrap || !this.commentWrap.nativeElement) {
            return;
        }
        const player = this.player;
        const commentWrap = this.commentWrap.nativeElement;
        const comments = this.comments;
        const currentTime = this.currentTime = player.currentTime;

        // 채팅 코멘트
        let latestIndex = -1;
        let temp = comments.filter((comment, i) => {
            const res = comment.time <= currentTime;
            if (res) {
                latestIndex = i;
            }
            return res;
        }).slice(-100);

        // for (let i = 1; i < 5; i++) {
        //     if (comments[latestIndex + i]) {
        //         temp.push(comments[latestIndex + i]);
        //     } else {
        //         break;
        //     }
        // }

        if (willUpdate || this.commentsForChat[this.commentsForChat.length - 1] !== temp[temp.length - 1]) {
            this.commentsForChat = temp;
            this.commentsForChat.forEach(item => {
                item.timeForDisplay = this.toTimeForDisplay(item.time);
            });
            if (commentWrap.clientHeight + commentWrap.scrollTop >= commentWrap.scrollHeight - 10) {
                setTimeout(() => {
                    commentWrap.scrollTop = 1000000;
                }, 10);
            }
        }
    }

    toTimeForDisplay = time => {
        return `${Math.floor(time / 60000)}:${String(Math.floor(time / 1000) % 60).length === 1 ? '0' : ''}${Math.floor(time / 1000) % 60}`;
    };

    floor(v) { return Math.floor(v); }
    countDown(time) {
        time = Math.max(0, time);
        return `${Math.floor(time / 60000)}:${String(Math.floor(time / 1000) % 59 + 1).length === 1 ? '0' : ''}${Math.floor(time / 1000) % 59 + 1}`;
    }

    async updateVideo() {
        this.videoData = null;
        this.currentTime = null;
        this.comments = [];
        this.commentsForChat = [];
        if (!this.videoId) {
            return;
        }
        this.getVideo();
    }

    async getVideo() {
        const pk = ++this.getVideoCallCount;
        const videoId = this.videoId;
        try {
            const res = await this._api.getVideo({ videoId });
            if (pk == this.getVideoCallCount) {
                this.latestGetVideoId = videoId;
                this.video = res;
                this.resource = res.resource;
                this.comments = res.comments;
                this.comments.sort((a, b) => a.time - b.time);
                document.title = res.title;
                this.renderForTimeline();
                this.updateCommentsForList();

            }
        } catch (e) {
            if (pk == this.getVideoCallCount) {
                this.latestGetVideoId = videoId;
            }
        }
    }

    resize() {
        if (!this.videoWrap || !this.videoWrap.nativeElement) {
            return;
        }
        const width = this.videoWrap.nativeElement.offsetWidth;
        const scale = this.videoScale = Math.min(1, width / this.videoWidth);

        this.canvas.nativeElement.width = width;
        this.canvas.nativeElement.height = this.videoHeight * scale;

        this.artCanavas.nativeElement.width = width;
        this.artCanavas.nativeElement.height = this.videoHeight * scale;

        if (!this.timelineCanvas || !this.timelineCanvas.nativeElement) {
            return;
        }
        this.timelineCanvas.nativeElement.width = this.timelineCanvas.nativeElement.parentNode.clientWidth;
        this.timelineCanvas.nativeElement.height = this.timelineCanvas.nativeElement.parentNode.clientHeight;

        this.renderForTimeline();
        this.renderArt();
    }

    openSignInPopup() {
        // const dialog = this._dialog.open(SignInComponent, { maxWidth: '95%', maxHeight: '95%', width: '450px', height: '450px' });
        // dialog.componentInstance.redirectType = 'refresh';
        this._core.signIn();
    }

    openUserDialog(userId: number) {
        const dialog = this._dialog.open(UserHistoryComponent, { maxWidth: '90vw', maxHeight: '70vh', width: '600px', height: '900px' });
        dialog.componentInstance.userId = userId;
    }

    renderArt() {
        const ctx = this.artContext;
        ctx.clearRect(-100, -100, 10000, 10000);
        ctx.textBaseline = 'hanging';
        ctx.textAlign = 'left';
        ctx.fillStyle = `red`;
        ctx.font = `bold ${this.relativeFontSize}px 맑은고딕`;
        this.artComments.forEach(comment => {
            ctx.fillText(
                comment.text,
                Math.floor(this.map(comment.x, 0, this.virtualInputWidth, 0, ctx.canvas.width)),
                Math.floor(this.map(comment.y, 0, this.virtualInputHeight, 0, ctx.canvas.height))
            );
        });
    }

    clearArtComment() {
        if (!confirm('정말로 작성한 구름아트를 초기화하시겠습니까?')) {
            return;
        }
        this.artComments = [];
        this.renderArt();
    }

    backArtComment() {
        this.artComments.pop();
        this.renderArt();
    }

    onChangeComment(comment: any) {
        const temp = this.comments.find(item => item.id === comment.id);
        if (temp) {
            this.comments.splice(this.comments.indexOf(temp), 1);
            this.comments.push(comment);
            this.comments.sort((a, b) => a.time - b.time);
            this.updateCommentsForChat(true);
            this.updateCommentsForList();
        }
    }

    map(n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    }

    _videoId: string;
    get videoId() {
        return this._videoId;
    }
    @Input() set videoId(next) {
        if (this.isAfterContentInit && this._videoId !== next) {
            this._videoId = next;
            this.updateVideo();
            this.resize();
        } else {
            this._videoId = next;
        }
    }

    trackByComment(i, item) { return item.id; }
    trackByAlert(i, item) { return item.id; }
    trackByChar(i, item) { return item; }
}
