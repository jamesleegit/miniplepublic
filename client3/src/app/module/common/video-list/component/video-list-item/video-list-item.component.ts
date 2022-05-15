import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-video-list-item',
  templateUrl: './video-list-item.component.html',
  styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnInit {

  constructor(private _domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }
  @Input() data: any;

  @Output() onClick= new EventEmitter();
}
