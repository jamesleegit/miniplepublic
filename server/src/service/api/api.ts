import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import multer from 'multer';
import fs from 'fs';
import https from 'https';
import stream from 'stream';
import {Strategy} from 'passport-google-oauth20';
import {ParamsDictionary, Request, Response} from "express-serve-static-core";
import {DbModule} from '../../module/db.module';
import {
    WEB_SERVER_PORT,
    IS_HTTPS,
    GOOGLE_OAUTH_CLIENT_ID,
    GOOGLE_OAUTH_SECRET_KEY,
    GOOGLE_OAUTH_CALLBACK_URL
} from '../../config';
import {DataModule} from '../../module/data.module';
import {
    IVideoComment,
    IUser,
    IVideo,
    IAccessLog,
    IResource,
    IVideoViews,
    IBoardTask
} from '../../interface';
import {UserApi} from './parts/user.api';
import {NextFunction} from 'connect';
import path from "path";
import {shuffle} from '../../lib/util.lib';
const greenlockExpress = require('greenlock-express');

export class Api {
    constructor(private _db : DbModule) {
        this.run();
    }
    $videoViews : any = {};
    $users = new DataModule<IUser>(['id', 'googleId']);
    $videoComments = new DataModule<IVideoComment>(['id', 'videoId']);
    async run() {
        const _db = this._db;
        this.$users.set(await this._db.query(`select * from user`));
        this.$videoComments.set(await this._db.query(`select * from video_comment`));

        // api 파츠생성
        const userApi = new UserApi(_db, this);

        // Express 환경설정
        const app = express();

        app.use(cors({origin: true, credentials: true}));

        app.use(session({secret: '@reor@', resave: false, saveUninitialized: true}));
        app.use(bodyParser());

        const upload = multer();

        // 구글 로그인 연동
        app.use(passport.initialize());
        app.use(passport.session());
        passport.use(new Strategy({
            clientID: GOOGLE_OAUTH_CLIENT_ID,
            clientSecret: GOOGLE_OAUTH_SECRET_KEY,
            callbackURL: GOOGLE_OAUTH_CALLBACK_URL
        }, (accessToken, refreshToken, profile, cb) => {
            return cb(null, profile);
        }));
        passport.serializeUser(async (user : any, done) => {
            try {
                await userApi.googleAuth({
                    googleId: user.id,
                    nickname: user.displayName,
                    thumbnailSrc: user.photos[0] ? user.photos[0].value : ''
                });
            } catch (e) {}
            done(null, user);
        });
        passport.deserializeUser((user : any, done) => {
            done(null, user);
        });
        app.get('/api/user/sign-in/google', passport.authenticate('google', {scope: ['profile']}));
        app.get('/api/user/sign-in/google/callback', passport.authenticate('google', {
            failureRedirect: '/api/user/sign-in/google/faild',
            successRedirect: '/api/user/sign-in/google/success'
        }));
        app.get('/api/user/sign-in/google/faild', (req, res) => res.status(200).end('<html><body><script>if (window.opener) { window.opener.postMessage("faild", "*"); window.close(); }</script></body></html>'));
        app.get('/api/user/sign-in/google/success', (req, res) => res.status(200).end('<html><body><script>if (window.opener) { window.opener.postMessage("success", "*"); window.close(); }</script></body></html>'));
        app.get('/api/user/sign-out/google', async (req, res) => {
            req.logout();
            req.session.destroy(function (err) {
                res.status(200).end('');
            });
        });

        app.use('/', async (req, res, next) => {
            req.session.ip = String(req.ip).replace('::ffff:', '');
            if (req.isAuthenticated()) {
                const user = this.$users.getItem({googleId: req.session.passport.user.id});
                if (user) {
                    if (user.isBlock) {
                        res.status(400).end('차단된 사용자입니다.');
                        return;
                    } else if (user.isExit) {} else {
                        req.session.user = user;
                    }
                }
            }
            next();
        });

        // API
        app.get('/api/user/board-comments', async (req, res) => {
            interceptor(req, res, data => userApi.getBoardComments(data), {
                start: new ApiData(req.query.start, 'number'),
                limit: new ApiData(req.query.limit, 'number'),
                taskId: new ApiData(req.query.taskId, 'number')
            });
        });
        app.post('/api/user/board-comment', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, data => userApi.insertBoardComment(data), {
                userId: req.session.user.id,
                taskId: new ApiData(req.body.taskId, 'number'),
                text: new ApiData(req.body.text, 'string')
            });
        });
        app.post('/api/user/delete-board-task', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, data => userApi.deleteBoardTask(data), {
                userId: req.session.user.id,
                id: new ApiData(req.body.id, 'number')
            });
        });
        app.post('/api/user/board-task', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, data => userApi.insertBoardTask(data), {
                userId: req.session.user.id,
                category: new ApiData(req.body.category, 'string'),
                title: new ApiData(req.body.title, 'string'),
                content: new ApiData(req.body.content, 'string')
            });
        });
        app.get('/api/user/board-tasks', async (req, res) => {
            interceptor(req, res, data => userApi.getBoardTasks(data), {
                start: new ApiData(req.query.start, 'number'),
                limit: new ApiData(req.query.limit, 'number'),
                category: new ApiData(req.query.category, 'string')
            });
        });
        app.get('/api/user/board-task', async (req, res) => {
            interceptor(req, res, data => userApi.getBoardTask(data), {
                id: new ApiData(req.query.id, 'number')
            });
        });


        app.post('/api/user/change-profile', this.isLoggedIn, async (req, res) => {});

        app.post('/api/user/upload-video-for-youtube', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.uploadVideoForYoutube(data), {
                userId: req.session.user.id,
                title: new ApiData(req.body.title, 'string'),
                videoId: new ApiData(req.body.videoId, 'string')
            });
        });

        let videoTags = await _db.query(`select * from video_tag order by viewOrder desc limit 100`);
        setInterval(async () => {
            try {
                videoTags = await _db.query(`select * from video_tag order by viewOrder desc limit 100`);
            } catch (e) {}
        }, 1000 * 60);

        setInterval(async () => {
            try {
                const dayRankings = await _db.query(`select * from video where createTime >= date_add(now(), interval -3 day) order by views desc limit 50`);
                await _db.query(`update video_tag set videoIds=? where name="일간랭킹"`, [dayRankings.length > 0 ? shuffle(dayRankings.map(item => item.id)).join(',') : '']);

                const weekRankings = await _db.query(`select * from video where createTime >= date_add(now(), interval -7 day) order by views desc limit 50`);
                await _db.query(`update video_tag set videoIds=? where name="주간랭킹"`, [weekRankings.length > 0 ? shuffle(weekRankings.map(item => item.id)).join(',') : '']);

                const monthRankings = await _db.query(`select * from video where createTime >= date_add(now(), interval -31 day) order by views desc limit 50`);
                await _db.query(`update video_tag set videoIds=? where name="월간랭킹"`, [monthRankings.length > 0 ? shuffle(monthRankings.map(item => item.id)).join(',') : '']);
            } catch (e) {}
        }, 1000 * 60 * 10);

        app.get('/api/user/video-tags', (req, res) => {
            res.status(200).json({
                videoTags: videoTags.map(item => ({id: item.id, limit: item.limit, name: item.name, viewOrder: item.viewOrder, viewOrder2: item.viewOrder2}))
            });
        });
        app.get('/api/user/standard', async (req, res) => {
            res.status(200).json({
                user: req.session.user ? {
                    ...req.session.user,
                    nickname: req.session.user.nickname,
                    googleId: null
                } : null
            });
        });

        app.post('/api/user/comment', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.writeComment(data), {
                userId: req.session.user.id,
                videoId: new ApiData(req.body.videoId, 'number'),
                text: new ApiData(req.body.text, 'string'),
                time: new ApiData(req.body.time, 'number'),
                x: new ApiData(req.body.x, 'number'),
                y: new ApiData(req.body.y, 'number')
            });
        });

        app.get('/api/user/videos', async (req, res) => {
            interceptor(req, res, (data) => userApi.getVideos(data), {
                start: new ApiData(req.query.start, 'number'),
                sort: req.query.sort,
                keyword: req.query.keyword
            });
        });

        app.get('/api/user/videos-by-tag', async (req, res) => {
            interceptor(req, res, (data) => userApi.getVideosByTag(data), {
                tagId: new ApiData(req.query.tagId, 'number')
            });
        });

        app.get('/api/user/video', async (req, res) => {
            interceptor(req, res, (data) => userApi.getVideo(data), {
                videoId: new ApiData(req.query.videoId, 'number'),
                userId: req.session.user ? req.session.user.id : null,
                ip: req.session.ip
            });
        });

        app.post('/api/user/bookmark-video', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.bookmarkVideo(data), {
                videoId: new ApiData(req.body.videoId, 'number'),
                userId: req.session.user.id
            });
        });
        app.post('/api/user/un-bookmark-video', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.unBookmarkVideo(data), {
                videoId: new ApiData(req.body.videoId, 'number'),
                userId: req.session.user.id
            });
        });
        app.post('/api/user/remove-comment', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.removeComment(data), {
                userId: req.session.user.id,
                commentId: new ApiData(req.body.id, 'number')
            });
        });
        app.get('/api/user/user-comments', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.getVideoCommentsByUserId(data), {
                userId: req.session.user.id,
                start: new ApiData(req.query.start, 'number'),
                limit: new ApiData(req.query.limit, 'number')
            });
        });
        app.get('/api/user/user-bookmarks', this.isLoggedIn, async (req, res) => {
            interceptor(req, res, (data) => userApi.getBookmarks(data), {
                userId: req.session.user.id,
                start: new ApiData(req.query.start, 'number'),
                limit: new ApiData(req.query.limit, 'number')
            });
        });
        // app.get('/api/user/user', async (req, res) => {
        //     interceptor(req, res, (data) => userApi.getUser(data), {
        //         userId: new ApiData(req.query.userId, 'number')
        //     });
        // });


        // app.get('/api/user/user/like-videos', async (req, res) => {
        //     interceptor(req, res, (data) => userApi.getLikeVideos(data), {
        //         userId: new ApiData(req.query.userId, 'number'),
        //         start: new ApiData(req.query.start, 'number'),
        //         limit: new ApiData(req.query.limit, 'number')
        //     });
        // });

        // app.get('/api/user/user/upload-videos', async (req, res) => {
        //     interceptor(req, res, (data) => userApi.getUploadVideos(data), {
        //         userId: new ApiData(req.query.userId, 'number'),
        //         start: new ApiData(req.query.start, 'number'),
        //         limit: new ApiData(req.query.limit, 'number')
        //     });
        // });

        // 클라이언트
        app.use('/', express.static('./public/client'));
        app.use('/util', express.static('./public/util'));
        app.get('**', (req, res) => res.status(200).end(fs.readFileSync('./public/client/index.html')));


        // 서버오픈
        if (IS_HTTPS) {
            greenlockExpress.init({
                packageRoot: path.join(__dirname, '../../../'),
                configDir: './greenlock.d',
                maintainerEmail: 'jw10aa@gmail.com'
            }).serve(app);
        } else {
            app.listen(WEB_SERVER_PORT);
        }
    }


    isLoggedIn(req : Request < ParamsDictionary, any, any >, res : Response < any >, next : NextFunction) {
        if (!req.isAuthenticated()) {
            res.status(400).end('로그인 후 이용해주세요.');
            return;
        }
        next();
    }

    isAdmin(req : Request < ParamsDictionary, any, any >, res : Response < any >, next : NextFunction) {
        if (!req.isAuthenticated() || !req.session.user.isAdmin) {
            res.status(400).end('권한부족');
            return;
        }
        next();
    }
}

export const interceptor = (req : Request < ParamsDictionary, any, any >, res : Response < any >, func : (data) => Promise<any>, data : {
[key: string]: ApiData | string | number | Express.Multer.File | Express.Multer.File[] | {
    [fieldname: string]: Express.Multer.File[];
    };
}) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (let key in data) {
                const item = data[key];
                if (item instanceof ApiData) {
                    if (item.isValid) {
                        data[key] = item.value;
                    } else {
                        throw new ApiError('알 수 없는 에러');
                    }
                }
            }
            const result = await func(data);
            if (typeof result === 'object') {
                res.status(200).json(result);
            } else {
                res.status(200).end('');
            }

            resolve();
        } catch (e) {
            console.log(e);
            if (e instanceof ApiError) {
                res.status(e.status).end(e.message);
            } else {
                res.status(400).end('알 수 없는 에러');
            }
            reject(e);
        }
    });
};
export class ApiError {
    constructor(public message, public status = 400) {}
}

export class ApiData {
    constructor(public value : any, public type : 'number' | 'string') {
        if (type === 'number') {
            if (typeof value !== 'number' && !isNaN(Number(value))) {
                this.value = Number(value);
            }
        }
    }
    get isValid() {
        if (this.type === 'number') {
            return typeof this.value === 'number' && !isNaN(this.value);
        }
        if (this.type === 'string') {
            return typeof this.value === 'string';
        }
    }
}
