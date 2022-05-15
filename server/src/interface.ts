export interface IVideoComment {
    id?: number;
    videoId?: number;
    x?: number;
    y?: number;
    time?: number;
    text?: string;
    userId?: number;
    createTime?: string;
}

export interface IUser {
    id?: number;
    googleId?: string;
    thumbnailSrc?: string;
    nickname?: string;
    createTime?: string;
    isBlock?: number;
    isExit?: number;
}

export interface IVideo {
    id?: number;
    title?: string;
    description?: string;
    resourceId?: number;
    userId?: number;
    createTime?: string;
    views?: number;
}

export interface IVideoBookmark {
    id?: number;
    videoId?: number;
    userId?: number;
    createTime?: string;
}

export interface IAccessLog {
    id?: number;
    type?: string;
    userId?: number;
    opt1?: string;
    createTime?: string;
}

export interface IResource {
    id?: number;
    origin?: string;
    originId?: string;
    fileName?: string;
    userId?: number;
    createTime?: string;
    thumbnailSrc1?: string;
    thumbnailSrc2?: string;
    thumbnailSrc3?: string;
}

export interface IVideoViews {
    id?: number;
    videoId?: number;
    ip?: string;
    createTime?: string;
}

export interface IBoardTask {
    id?: number;
    category?: string;
    title?: string;
    content?: string;
    userId?: number;
    createTime?: string;
    views?: number;
    commentCount?: number;
}

export interface IBoardComment {
    id?: number;
    text?: string;
    createTime?: string;
    userId?: number;
    taskId?: number;
}