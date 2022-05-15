import {Api, ApiError} from "../api";
import {DbModule} from "../../../module/db.module";
import mysql from 'mysql';
import axios from 'axios';
import {
    IUser,
    IVideoComment,
    IResource,
    IBoardTask,
    IBoardComment,
    IVideo
} from "../../../interface";
import {generateDarkHexColorCode, sleep} from "../../../lib/util.lib";
import stream from 'stream';
import moment from 'moment';
import {GOOGLE_API_KEY} from "../../../config";

export class UserApi {
    constructor(private _db : DbModule, private _api : Api) {}

    signOut(data : {
        userId: number;
    }) {
        return new Promise<IUser>(async (resolve, reject) => {
            try {
                const row: IUser = (this._db.query(`select * from user where id=?`, [data.userId]))[0];
                if (! row) {
                    throw new ApiError('존재하지 않는 사용자');
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    signUped : any = {};
    googleAuth(data : {
        googleId: string;
        nickname: string;
        thumbnailSrc: string;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!this.signUped[data.googleId] && !(await this._db.query(`select * from user where googleId=?`, [data.googleId]))[0]) {
                    this.signUped[data.googleId] = true;
                    let insertId;
                    try {
                        const temp = await this._db.query(`insert into user (googleId, createTime) values (?, now())`, [data.googleId]);
                        insertId = temp.insertId;
                    } catch (e) {
                        this.signUped[data.googleId] = false;
                        throw null;
                    }
                    // 메모리저장
                    const finalRow = (await this._db.query(`select * from user where id=?`, [insertId]))[0];
                    this._api.$users.insert(finalRow);
                }
                const row = (await this._db.query(`select * from user where googleId=?`, [data.googleId]))[0];
                if (! row) {
                    throw new ApiError('Invalid user');
                }
                if (row.isBlock) {
                    throw new ApiError('차단된 사용자입니다.');
                }

                await this._db.query(`update user set thumbnailSrc=?, nickname=? where id=?`, [data.thumbnailSrc, data.nickname, row.id]);

                // 메모리저장
                const finalRow = (await this._db.query(`select * from user where googleId=?`, [data.googleId]))[0];
                this._api.$users.update({
                    googleId: data.googleId
                }, finalRow);

                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    // 게시판

    toBoardTask(item : IBoardTask) {
        return item;
    }

    toBoardComment(item : IBoardComment) {
        return item;
    }

    getBoardTasks(data : {
        category: string;
        start: number;
        limit: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.limit > 50) {
                    data.limit = 50;
                }
                const rows = await this._db.query(`select id, title, createTime, userId, views, commentCount, imageSrcs from board_task where category=? and enabled=1 order by id desc limit ${
                    data.start
                }, ${
                    data.limit
                }`, [data.category]);
                const notices = await this._db.query(`select id, title, createTime, userId, views, commentCount, imageSrcs from board_task where category="notice" and enabled=1 order by id desc`);
                if (rows.length > 0) {
                    const users = await this._db.query(`select * from user where ${
                        rows.map(item => `id=${
                            mysql.escape(item.userId)
                        }`).join(' or ')
                    }`);
                    rows.forEach(item => {
                        const temp = users.find(_item => _item.id === item.userId);
                        if (temp) {
                            item.user = this.toUser(temp);
                        }
                    });
                }
                resolve({
                    allCount: (await this._db.query(`select count(*) from board_task where category=? and enabled=1`, [data.category]))[0]['count(*)'],
                    notices: notices.map(item => this.toBoardTask(item)),
                    list: rows.map(item => this.toBoardTask(item))
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    getBoardTask(data : {
        id: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                const row = (await this._db.query(`select * from board_task where id=? and enabled=1`, [data.id]))[0];
                if (! row) {
                    throw new ApiError('게시물을 찾을 수 없습니다.');
                }
                const users = await this._db.query(`select * from user where ${
                    [row].map(item => `id=${
                        mysql.escape(item.userId)
                    }`).join(' or ')
                }`);
                const temp = users.find(_item => _item.id === row.userId);
                if (temp) {
                    row.user = this.toUser(temp);
                }
                await this._db.query(`update board_task set views=views+1 where id=?`, [data.id]);
                row.views += 1;
                resolve(this.toBoardTask(row));
            } catch (e) {
                reject(e);
            }
        });
    }

    deleteBoardTask(data : {
        id: number;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                const row = (await this._db.query(`select * from board_task where id=? and enabled=1`, [data.id]))[0];
                if (! row) {
                    throw new ApiError('게시물을 찾을 수 없습니다.');
                }
                await this._db.query(`update board_task set enabled=0 where id=?`, [data.id]);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    insertBoardTask(data : {
        category: string;
        title: string;
        content: string;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try { // , 'humor'
                if (['improve', 'free'].indexOf(data.category) === -1) {
                    throw new ApiError('존재하지않는 게시판입니다.');
                }
                data.title = data.title.trim();
                data.content = data.content.trim();
                if (!data.title || !data.content) {
                    throw new ApiError('제목 혹은 내용을 입력해주세요.');
                }
                if (data.title.length > 100) {
                    throw new ApiError('제목은 100글자 이하로 입력해주세요.');
                }
                if (data.content.length > 5000) {
                    throw new ApiError('내용은 5000글자 이하로 입력해주세요.');
                }
                const latestRow = (await this._db.query(`select id, createTime from board_task where userId=? order by id desc limit 1`, [data.userId]))[0];
                if (latestRow && new Date().getTime() - new Date(latestRow.createTime).getTime() < 1000 * 30) {
                    throw new ApiError('게시글은 30초 간격으로 작성할 수 있습니다.\n조금만 기다려주세요.\n(남은시간:' + Math.floor(((1000 * 30) - (new Date().getTime() - new Date(latestRow.createTime).getTime())) / 1000) + '초)');
                }
                const {insertId} = await this._db.query(`insert into board_task (userId, category, title, content,  createTime, views, commentCount, enabled) values (?, ?, ?, ?, now(), 0, 0, 1)`, [data.userId, data.category, data.title, data.content]);
                const row = (await this._db.query(`select id from board_task where id=?`, [insertId]))[0];
                resolve({taskId: row.id});
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    getBoardComments(data : {
        taskId: number;
        start: number;
        limit: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.limit > 50) {
                    data.limit = 50;
                }
                const row = (await this._db.query(`select id from board_task where id=? and enabled=1`, [data.taskId]))[0];
                if (! row) {
                    throw new ApiError('게시물을 찾을 수 없습니다.');
                }
                const rows = await this._db.query(`select * from board_comment where taskId=? order by id desc limit ${
                    data.start
                }, ${
                    data.limit
                }`, [data.taskId]);

                const allCount = (await this._db.query(`select count(*) from board_comment where taskId=?`, [data.taskId]))[0]['count(*)'];
                if (rows.length > 0) {
                    const users = await this._db.query(`select * from user where ${
                        rows.map(item => `id=${
                            mysql.escape(item.userId)
                        }`).join(' or ')
                    }`);
                    rows.forEach(item => {
                        const temp = users.find(_item => _item.id === item.userId);
                        if (temp) {
                            item.user = this.toUser(temp);
                        }
                    });
                }
                resolve({
                    allCount,
                    list: rows.map(item => this.toBoardComment(item))
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    insertBoardComment(data : {
        taskId: number;
        text: string;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                data.text = data.text.trim();
                if (!data.text) {
                    throw new ApiError('내용을 입력해주세요.');
                }
                if (data.text.length > 500) {
                    throw new ApiError('500글자 이하로 입력해주세요.');
                }
                const taskRow = (await this._db.query(`select id, category from board_task where id=? and enabled=1`, [data.taskId]))[0];
                if (! taskRow || taskRow.category === 'notice') {
                    throw new ApiError('댓글을 달 수 없습니다.');
                }
                const latestRow = (await this._db.query(`select * from board_comment where userId=? order by id desc limit 1`, [data.userId]))[0];
                if (latestRow && new Date().getTime() - new Date(latestRow.createTime).getTime() < 1000 * 10) {
                    throw new ApiError('댓글은 10초 간격으로 작성할 수 있습니다.\n조금만 기다려주세요.\n(남은시간:' + Math.floor(((1000 * 10) - (new Date().getTime() - new Date(latestRow.createTime).getTime())) / 1000) + '초)');
                }
                const {insertId} = await this._db.query(`insert into board_comment (userId, taskId, text, createTime) values (?, ?, ?, now())`, [data.userId, data.taskId, data.text]);
                await this._db.query(`update board_task set commentCount=commentCount+1 where id=?`, [data.taskId]);
                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    // 비디오 리스트
    toVideoListItem(video) {
        return({
            id: video.id,
            title: video.title,
            thumbnailSrc: video.thumbnailSrc,
            createTime: video.createTime,
            ytId: video.ytId,
            views: video.views,
            duration: video.duration
            // commentCount: video.commentCount
        });
    }

    getVideosByTag(data : {
        tagId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data.tagId) {
                    throw null;
                }
                const tag = (await this._db.query(`select * from video_tag where id=?`, [data.tagId]))[0];
                if (! tag) {
                    throw null;
                }
                const arr = tag.videoIds ? tag.videoIds.split(',') : [];
                if (arr.length > 0) {
                    const list = (await this._db.query(`select * from video where ${
                        arr.map(item => `id=${
                            mysql.escape(item)
                        }`).join(' or ')
                    }`)).map(item => this.toVideoListItem(item));
                    list.sort((a, b) => arr.indexOf(String(a.id)) - arr.indexOf(String(b.id)));
                    resolve({list});
                } else {
                    resolve({list: []});
                }
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    getVideos(data : {
        start: number;
        sort?: string;
        keyword?: string;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                let start = Number(data.start);
                let limit = 30;
                const keyword = String(data.keyword || '').trim().split(' ').join('');

                if (isNaN(Number(start))) {
                    start = 0;
                }
                let orderBy = 'views desc';
                if (data.sort === 'createTime_desc') {
                    orderBy = 'createTime desc';
                }
                console.log(orderBy)

                resolve({
                    list: (await this._db.query(`select * from video
                    ${
                        keyword ? `
                    where title like ${
                            mysql.escape('%' + data.keyword + '%')
                        }
                    or ytTitle like ${
                            mysql.escape('%' + data.keyword + '%')
                        }` : ``
                    }
                    order by ${orderBy} limit ${start}, ${limit}`)).map(item => this.toVideoListItem(item))
                });
            } catch (e) {
                reject(e);
            }
        });
    }
    getVideo(data : {
        videoId: number;
        userId?: number;
        ip: string;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                data.videoId = Number(data.videoId);
                const video = (await this._db.query(`select * from video where id=?`, [data.videoId]))[0];
                if (! video) {
                    throw new ApiError('올바르지 않은 영상정보입니다.');
                }

                const tag = `${
                    data.ip
                }@${
                    data.videoId
                }`;
                if (!this._api.$videoViews[tag]) {
                    await this._db.query(`update video set views=views+1 where id=?`, [data.videoId]);
                    video.views = (video.views || 0) + 1;
                    this._api.$videoViews[tag] = true;
                }

                const comments = this._api.$videoComments.getItems({videoId: data.videoId});
                // await this._db.query(`select * from video_comment where videoId=?`, [data.videoId]);
                let isBookmark: boolean;
                if (data.userId) {
                    const row = (await this._db.query(`select * from video_bookmark where userId=? and videoId=?`, [data.userId, data.videoId]))[0];
                    isBookmark = !! row;
                }

                resolve({
                    title: video.title,
                    ytTitle: video.ytTitle,
                    ytId: video.ytId,
                    views: video.views,
                    createTime: video.createTime,
                    comments: comments.map(item => this.toVideoComment(item)),
                    id: video.id,
                    isBookmark
                });
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    bookmarkVideo(data : {
        videoId: number;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                const temp = (await this._db.query(`select * from video_bookmark where userId=? and videoId=?`, [data.userId, data.videoId]))[0];
                if (! temp) {
                    await this._db.query(`insert into video_bookmark (userId, videoId, createTime) values (?, ?, now())`, [data.userId, data.videoId]);
                }
                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    unBookmarkVideo(data : {
        videoId: number;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                const temp = (await this._db.query(`select * from video_bookmark where userId=? and videoId=?`, [data.userId, data.videoId]))[0];
                if (temp) {
                    await this._db.query(`delete from video_bookmark where id=?`, [temp.id]);
                }
                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    // 댓글관련 인터페이스
    toUser(item : IUser) {
        return {id: item.id, nickname: item.nickname, thumbnailSrc: item.thumbnailSrc}
    }

    toVideoComment(item : IVideoComment) {
        const user = this._api.$users.getItem({id: item.userId});
        return {
            id: item.id,
            text: item.text,
            time: item.time,
            x: item.x,
            y: item.y,
            createTime: item.createTime,
            user: user ? this.toUser(user) : null
        };
    }

    writeCommentCheckerTime : number;
    writeCommentChecker : {
    [userId: number]: any;
    } = {};
    writeComment(data : {
        videoId: number;
        userId: number;
        time: number;
        text: string;
        x: number;
        y: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                let {
                    videoId,
                    text,
                    time,
                    x,
                    y,
                    userId
                } = data;
                if (typeof text !== 'string') {
                    throw new ApiError('구름은 100글자 이하로 입력해주세요.');
                }
                text = text.trim();
                if (!text || text.length > 100) {
                    throw new ApiError('구름은 100글자 이하로 입력해주세요.');
                }
                if (!videoId) {
                    throw new ApiError('잘못된 접근입니다.');
                }

                const video = (await this._db.query(`select * from video where id=?`, [data.videoId]))[0];
                if (! video) {
                    throw new ApiError('존재하지 않는 동영상입니다.');
                }

                if (!this.writeCommentChecker[data.userId] || new Date().getTime() - this.writeCommentChecker[data.userId].createTime > 1000 * 10) {
                    this.writeCommentChecker[data.userId] = {
                        count: 1,
                        createTime: new Date().getTime()
                    };
                } else {
                    this.writeCommentChecker[data.userId].count += 1;
                }
                if (this.writeCommentChecker[data.userId].count >= 10) {
                    throw new ApiError('짧은시간에 여러개에 구름을 작성하셨습니다. 잠깐 기다려주세요.');
                }

                const {insertId} = await this._db.query(`insert into video_comment (videoId, text, time, x, y, userId, createTime) values (?, ?, ?, ?, ?, ?, now())`, [
                    videoId,
                    text,
                    time,
                    Number(x.toFixed(5)),
                    Number(y.toFixed(5)),
                    userId
                ]);

                const insertRow = (await this._db.query(`select * from video_comment where id=?`, [insertId]))[0];
                this._api.$videoComments.insert(insertRow);

                resolve(this.toVideoComment(insertRow));
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

    // // 유저관련 인터페이스
    // getUser(data : {
    //     userId: number;
    // }) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const user = this._api.$users.getItem({id: data.userId});
    //             if (! user) {
    //                 throw new ApiError('존재하지 않는 유저');
    //             }
    //             resolve({id: user.id, nickname: user.nickname, thumbnailSrc: user.thumbnailSrc});
    //         } catch (e) {
    //             reject(e);
    //         }
    //     });
    // }

    removeComment(data : {
        commentId: number;
        userId: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                const comment = this._api.$videoComments.getItem({id: data.commentId});
                if (! comment || data.userId !== comment.userId) {
                    throw null;
                }
                await this._db.query(`delete from video_comment where id=?`, [data.commentId]);
                this._api.$videoComments.remove({id: data.commentId});
                resolve();
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    getVideoCommentsByUserId(data : {
        userId: number;
        start: number;
        limit: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                let userId = Number(data.userId);
                let start = Number(data.start);
                let limit = Number(data.limit);

                if (isNaN(Number(start))) {
                    start = 0;
                }
                if (isNaN(Number(limit)) || limit > 30) {
                    limit = 30;
                }

                const rows = this._api.$videoComments.getItems({userId}).sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());

                const list: any = rows.slice(start, start + limit).map(item => {
                    return({
                        id: item.id,
                        createTime: item.createTime,
                        text: item.text,
                        time: item.time,
                        videoId: item.videoId
                    });
                });
                if (list.length > 0) {
                    const videos = await this._db.query(`select * from video where ${
                        list.map(item => `id=${
                            mysql.escape(item.videoId)
                        }`).join(' or ')
                    }`);
                    list.forEach(item => {
                        const temp = videos.find(_item => _item.id === item.videoId);
                        if (temp) {
                            item.video = this.toVideoListItem(temp);
                        }
                    });
                }
                resolve({allCount: rows.length, list});
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
    getBookmarks(data : {
        userId: number;
        start: number;
        limit: number;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                let userId = Number(data.userId);
                let start = Number(data.start);
                let limit = Number(data.limit);

                if (isNaN(Number(start))) {
                    start = 0;
                }
                if (isNaN(Number(limit)) || limit > 30) {
                    limit = 30;
                }

                const rows = await this._db.query(`select * from video_bookmark where userId=? order by createTime desc limit ${start}, ${limit}`, [userId]);
                if (rows.length > 0) {
                    const videos = await this._db.query(`select * from video where ${
                        rows.map(item => `id=${
                            mysql.escape(item.videoId)
                        }`).join(' or ')
                    }`);
                    rows.forEach(item => {
                        const temp = videos.find(_item => _item.id === item.videoId);
                        if (temp) {
                            item.video = this.toVideoListItem(temp);
                        }
                    });
                }

                resolve({
                    allCount: (await this._db.query(`select count(*) from video_bookmark where userId=?`, [data.userId]))[0]['count(*)'],
                    list: rows
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    // getUploadVideos(data : {
    //     userId: number;
    //     start: number;
    //     limit: number;
    // }) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             let userId = Number(data.userId);
    //             let start = Number(data.start);
    //             let limit = Number(data.limit);

    //             if (isNaN(Number(start))) {
    //                 start = 0;
    //             }
    //             if (isNaN(Number(limit)) || limit > 30) {
    //                 limit = 30;
    //             }

    //             const rows = this._memory.videos.getItems({userId}).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());

    //             const list = rows.slice(start, start + limit).map(item => this.toVideo(item));

    //             resolve({allCount: rows.length, list});
    //         } catch (e) {
    //             reject(e);
    //         }
    //     });
    // }


    latestUpload : any = {};
    uploadVideoForYoutube(data : {
        userId: number;
        videoId: string;
        title?: string;
    }) {
        return new Promise(async (resolve, reject) => {
            try {
                if (this.latestUpload[data.userId] && new Date().getTime() - this.latestUpload[data.userId] < 1000 * 20) {
                    throw new ApiError('잠시만 기다린 후 다시시도해주세요.');
                }
                if (!data.videoId) {
                    throw new ApiError('비디오 아이디를 입력해주세요.');
                }
                if (data.title && typeof data.title !== 'string') {
                    data.title = null;
                }
                data.videoId = data.videoId.trim();
                data.title = data.title.trim();
                if (!data.title) {
                    data.title = null;
                }

                // if (data.title && data.title.length > 200) {
                //     throw new ApiError('제목은 200글자 이하로 입력해주세요.');
                // }

                const videoId = data.videoId;
                const target = (await this._db.query(`select * from video where ytId=?`, [videoId]))[0];
                if (target) { // throw new ApiError('이미 업로드된 영상입니다.');
                    resolve({videoId: target.id, isError: true});
                    return;
                }
                let temp: any;
                try {
                    this.latestUpload[data.userId] = new Date().getTime();
                    const res = await axios(`https://www.googleapis.com/youtube/v3/videos?key=${GOOGLE_API_KEY}&id=${videoId}&part=snippet,contentDetails&fields=items(id,snippet(title,channelId,categoryId,tags,thumbnails,liveBroadcastContent),contentDetails)`);
                    // https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAynB1rbhirRTSMDzpetMI2Vg2N5wqPY8s&id=ujXOtrQGrHI&part=snippet,contentDetails&fields=items(id,snippet(title,channelId,categoryId,tags,thumbnails,liveBroadcastContent),contentDetails)
                    if (res.data.error || ! res.data.items || res.data.items.length === 0) {
                        throw null;
                    }
                    console.log(res.data.items[0]);
                    const target = res.data.items[0].snippet;
                    if (target.liveBroadcastContent !== 'none') {
                        throw new ApiError('실시간 방송이나, 아직 미공개 영상은 등록할 수 없습니다.');
                    }
                    const contentDetails = res.data.items[0].contentDetails;
                    // const aspectRatio = contentDetails.aspectRatio;
                    temp = {
                        title: target.title.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ''),
                        channelId: target.channelId,
                        categoryId: target.categoryId,
                        tags: String(target.tags),
                        publishTime: new Date(target.publishedAt),
                        thumbnailSrc: target.thumbnails ? ((target.thumbnails.standard || target.thumbnails.high || target.thumbnails.medium || target.thumbnails.default || {}).url || null) : null,
                        duration: moment.duration(contentDetails.duration).asMilliseconds(),
                        // aspectRatio: Number(aspectRatio.split('_')[2]) / Number(aspectRatio.split('_')[1])
                    };
                } catch (e) {
                    console.log(e);
                    throw new ApiError('영상정보를 찾지못하였거나, 유튜브 서버상태가 좋지않아 정보를 가져오는데에 실패하였습니다.');
                }
                const insertRow = await this._db.query(`insert into video
                    (title, thumbnailSrc, ytId, ytTitle, category, userId, aspectRatio, duration, ytCategoryId, ytChannelId, ytTags, commentCount, views, createTime)
                    values
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, now())`, [
                    data.title ? data.title : temp.title,
                    temp.thumbnailSrc,
                    data.videoId,
                    temp.title,
                    '',
                    data.userId,
                    null,
                    temp.duration,
                    temp.categoryId,
                    temp.channelId,
                    temp.tags
                ]);
                resolve({videoId: insertRow.insertId});
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }
}
