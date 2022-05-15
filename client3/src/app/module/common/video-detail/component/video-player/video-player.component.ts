import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnDestroy,
    OnInit,
    Renderer2,
    RendererStyleFlags2,
    ViewChild
} from '@angular/core';
import {map} from 'src/app/lib/util.lib';
import {ApiService} from 'src/app/service/api.service';
import {CoreService} from 'src/app/service/core.service';
import {YoutubePlayerComponent} from '../youtube-player/youtube-player.component';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
    animations: [trigger('commentInputLabel', [
            state('close', style({paddingBottom: '0'})),
            state('open', style({paddingBottom: '15px'})),
            transition('close=>open', [animate('100ms')]),
            transition('open=>close', [animate('100ms')])
        ])]
})
export class VideoPlayerComponent implements OnInit,
AfterContentInit,
OnDestroy {
    @ViewChild('videoDom', {static: true})videoDom : ElementRef;
    @ViewChild('canvas', {static: true})canvas : ElementRef;
    @ViewChild('commentPositionLayer', {static: true})commentPositionLayer : ElementRef;
    @ViewChild('commentInput', {static: true})commentInput : ElementRef;
    @ViewChild('youtubePlayer', {static: false})youtubePlayer : YoutubePlayerComponent;
    get player() {
        return this.youtubePlayer;
    }

    context : CanvasRenderingContext2D;
    contextRatio : number;
    isDestroyed = false;

    constructor(private _renderer2 : Renderer2, private _api : ApiService, public _core : CoreService) {}

    ngOnInit() {
        this.updateCommentPositionLayer();
    }

    ngAfterContentInit() {
        this.resize();
        if (this.commentInput && this.commentInput.nativeElement) {
            this.commentInput.nativeElement.focus();
            setTimeout(() => {
                this.commentInput.nativeElement.focus();
            }, 250);
        }
        if (this.canvas && this.canvas.nativeElement) {
            const ctx = this.context = this.canvas.nativeElement.getContext('2d');
            const devicePixelRatio = window.devicePixelRatio || 1;
            const backingStoreRatio = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1;
            const ratio = devicePixelRatio / backingStoreRatio;
            this.contextRatio = ratio;
        }
        window.requestAnimationFrame((timestamp : number) => this.render(timestamp));
    }
    ngOnDestroy() {
        this.isDestroyed = true;
        this.destoryCommentPositionLayerEvents();
    }

    prevWidth : number;
    prevHeight : number;
    relFontSize : Number;
    render(timestamp? : number) {
        if (this.isDestroyed) {
            return;
        }
        try {
            this.setWriteCommentTime();
            if (!this.videoDom || !this.videoDom.nativeElement || !this.player || !this.context || typeof this.player.currentTime !== 'number') {
                throw '';
            }
            const player = this.player;
            const canvas = this.canvas.nativeElement;
            const ctx = this.context;
            const comments = this.video.comments;
            const currentTime = player.currentTime;
            const durationTime = player.durationTime;
            const animationTime = 150;

            if (typeof currentTime !== 'number') {
                throw '';
            }
            const commentsForRender = comments.filter(comment => currentTime - 2000 <= comment.time && comment.time<= currentTime);

            const width = Math.floor(this.videoDom.nativeElement.clientWidth);
            const height = Math.floor(this.videoDom.nativeElement.clientHeight);
            const ratio = this.contextRatio;
            const relFontSize = this.relFontSize = Math.max(13, 30  * Math.min(width / 1600, 1));
           
            ctx.save();
            if (width !== this.prevWidth || height !== this.prevHeight) {
                canvas.width = Math.floor(width * ratio);
                canvas.height = Math.floor(height * ratio);
                canvas.style.width = width + "px";
                canvas.style.height = height + "px";
                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
                this.updateCommentPositionLayer();
            }
            this.prevWidth = width;
            this.prevHeight = height;

            // 댓글박스
            if (this.commentPositionLayer && this.commentPositionLayer.nativeElement){
                if(this.commentPositionLayer.nativeElement.clientWidth 
                    + map(this.writeCommentInput.x, 0, 1, 0, width)
                    > width) {
                    this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'left', `${
                        width - this.commentPositionLayer.nativeElement.clientWidth
                    }px`);
                }
                if(this.commentPositionLayer.nativeElement.clientHeight 
                    + map(this.writeCommentInput.y, 0, 1, 0, height)
                    > height) {
                    this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'top', `${
                        height - this.commentPositionLayer.nativeElement.clientHeight
                    }px`);
                }
            }

            ctx.clearRect(-100, -100, 10000, 10000);

            ctx.textBaseline = 'hanging';
            ctx.textAlign = 'left';
            ctx.font = `bold ${
                Math.floor(relFontSize)
            }px NEXON Lv1 Gothic OTF`;
            ctx.lineWidth = 2.5;
            commentsForRender.forEach(comment => {
                if (comment.artInfo) {
                    return;
                }
                const g = currentTime - comment.time;
                let opacity = 1;
                if (g <= animationTime) {
                    opacity = map(g, 0, animationTime, 0, 1);
                }
                if (g >= 2000 - animationTime) {
                    opacity = map(g, 2000 - animationTime, 2000, 1, 0);
                }
                ctx.fillStyle = `rgba(255,255,255,${opacity})`;
                ctx.strokeStyle = `rgba(0,0,0,${opacity})`;

                const w = ctx.measureText(comment.text).width;
                let x = map(comment.x, 0, 1, 0, width);
                if (w + x > width) {
                    x = width - w;
                }
                ctx.strokeText(comment.text, Math.floor(x), Math.floor(map(comment.y, 0, 1, 0, height)));
                ctx.fillText(comment.text, Math.floor(x), Math.floor(map(comment.y, 0, 1, 0, height)));
            });

            this.highlightComments.forEach(item => item.createTime = !item.createTime ? new Date().getTime() : item.createTime);
            this.highlightComments.forEach(({comment, createTime}) => {
                const g = new Date().getTime() - createTime;
                const interval = 250;
                if (g >= interval * 6) {
                    return;
                }
                let opacity = 1;
                if (Math.floor(g / interval) % 2 === 0) {
                    opacity = map(g % interval, 0, interval, 0, 1);
                } else {
                    opacity = map(g % interval, 0, interval, 1, 0);
                } ctx.fillStyle = `rgba(255,255,0,${opacity})`;
                ctx.strokeStyle = `rgba(0,0,0,${opacity})`;

                const w = ctx.measureText(comment.text).width;
                let x = map(comment.x, 0, 1, 0, width);
                if (w + x > width) {
                    x = width - w;
                }
                ctx.strokeText(comment.text, Math.floor(x), Math.floor(map(comment.y, 0, 1, 0, height)));
                ctx.fillText(comment.text, Math.floor(x), Math.floor(map(comment.y, 0, 1, 0, height)));
            });
            ctx.restore();
        } catch (e) {}
        window.requestAnimationFrame((timestamp : number) => this.render(timestamp));
    }
    resize() {
        if (!this.videoDom || !this.videoDom.nativeElement || !this.canvas || !this.canvas.nativeElement) {
            return;
        }
        const e = this.videoDom.nativeElement;
        const w = e.clientWidth;
        this._renderer2.setStyle(e, 'height', `${
            w * this.videoRatio
        }px`);
        this.videoScale = w / this.videoWidth;
    }
    writeCommentInput = {
        text: '',
        time: null,
        x: map(Math.random(), 0, 1, 0.1, .9),
        y: map(Math.random(), 0, 1, 0.1, .9)
    };
    async setWriteCommentTime() {
        if (!this.commentInput || !this.commentInput.nativeElement) {
            return;
        }
        const str = this.commentInput.nativeElement.value;
        if (! str) {
            this.writeCommentInput.time = null;
        } else if (this.writeCommentInput.time === null && str) {
            this.writeCommentInput.time = this.player ? (this.player.currentTime || 0) : 0;
        }
    }
    isWritingComment = false;
    highlightComments : any = [];
    async writeComment() {
        if (!this.video || this.isWritingComment) {
            return;
        }
        this.writeCommentInput.text = this.writeCommentInput.text ? String(this.writeCommentInput.text).trim() : null;
        if (this.writeCommentInput.time === null || !this.writeCommentInput.text) {
            return;
        }
        this.isWritingComment = true;
        try {
            const videoId = this.video.id;
            const res: any = await this._api.writeComment({
                videoId,
                time: this.writeCommentInput.time,
                x: this.writeCommentInput.x,
                y: this.writeCommentInput.y,
                text: this.writeCommentInput.text
            });
            this.writeCommentInput.text = '';
            this.writeCommentInput.time = null;
            if (this.video && this.video.id === videoId) {
                this.video.comments = [
                    res,
                    ...this.video.comments
                ];
                this.highlightComments.push({comment: res, createTime: null});
            }
        } catch (e) {}
        this.isWritingComment = false;
    }

    isInitedCommentPositionLayer = false;

    updateCommentPositionLayer() {
        if (this.commentPositionLayer && this.commentPositionLayer.nativeElement && this.videoDom && this.videoDom.nativeElement && this.relFontSize) {
            const width = Math.floor(this.videoDom.nativeElement.clientWidth);
            const height = Math.floor(this.videoDom.nativeElement.clientHeight);
            this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'left', `${
                map(this.writeCommentInput.x, 0, 1, 0, width)
            }px`);
            this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'top', `${
                map(this.writeCommentInput.y, 0, 1, 0, height)
            }px`);
            this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'font-size', `${
                this.relFontSize
            }px`, RendererStyleFlags2.Important);
            this.isInitedCommentPositionLayer = true;
        }
    }

    commentPositionLayerTemp = {
        pos1: 0,
        pos2: 0,
        pos3: 0,
        pos4: 0
    }
    $onMouseUpCommentPositionLayer = this.onMouseUpCommentPositionLayer.bind(this);
    $onMouseMoveCommentPositionLayer = this.onMouseMoveCommentPositionLayer.bind(this);
    onMouseDownCommentPositionLayer(e : any) {
        // console.log('down', e);
        const x = e.clientX || e.touches[0].clientX;
        const y = e.clientY || e.touches[0].clientY;
        this.commentPositionLayerTemp.pos3 = x;
        this.commentPositionLayerTemp.pos4 = y;
        document.addEventListener('mouseup', this.$onMouseUpCommentPositionLayer);
        document.addEventListener('mousemove', this.$onMouseMoveCommentPositionLayer);
        document.addEventListener('touchend', this.$onMouseUpCommentPositionLayer);
        document.addEventListener('touchcancel', this.$onMouseUpCommentPositionLayer);
        document.addEventListener('touchmove', this.$onMouseMoveCommentPositionLayer, {passive: false});
    }
    destoryCommentPositionLayerEvents(){
        document.removeEventListener('mouseup', this.$onMouseUpCommentPositionLayer);
        document.removeEventListener('mousemove', this.$onMouseMoveCommentPositionLayer);
        document.removeEventListener('touchend', this.$onMouseUpCommentPositionLayer);
        document.removeEventListener('touchcancel', this.$onMouseUpCommentPositionLayer);
        document.removeEventListener('touchmove', this.$onMouseMoveCommentPositionLayer);
    }
    onMouseUpCommentPositionLayer(e?: any) {
        // console.log('up', e);
        this.destoryCommentPositionLayerEvents();
    }
    onMouseMoveCommentPositionLayer(e : any) {
        // console.log('move', e);
        const event = e || window.event;
        event.preventDefault();
        const x = event.clientX || event.touches[0].clientX;
        const y = event.clientY || event.touches[0].clientY;
        this.commentPositionLayerTemp.pos1 = this.commentPositionLayerTemp.pos3 - x;
        this.commentPositionLayerTemp.pos2 = this.commentPositionLayerTemp.pos4 - y;
        this.commentPositionLayerTemp.pos3 = x;
        this.commentPositionLayerTemp.pos4 = y;
        if (this.commentPositionLayer && this.commentPositionLayer.nativeElement && this.videoDom && this.videoDom.nativeElement) {
            const top = Math.max(0, (this.commentPositionLayer.nativeElement.offsetTop - this.commentPositionLayerTemp.pos2));
            const left = Math.max(0, (this.commentPositionLayer.nativeElement.offsetLeft - this.commentPositionLayerTemp.pos1));

            this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'top', top + "px");
            this._renderer2.setStyle(this.commentPositionLayer.nativeElement, 'left', left + "px");
            const width = Math.floor(this.videoDom.nativeElement.clientWidth);
            const height = Math.floor(this.videoDom.nativeElement.clientHeight);
            this.writeCommentInput.x = map(left, 0, width, 0, 1);
            this.writeCommentInput.y = map(top, 0, height, 0, 1);
        }
    }

    videoWidth = 400;
    // videoHeight = 225;
    videoHeight = 260;
    videoScale : number;
    get videoRatio() {
        return this.videoHeight / this.videoWidth;
    }

    @Input()video : any;
    @Input()isEmbed = false;
}
