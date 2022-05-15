import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-video-list-item-sm',
  templateUrl: './video-list-item-sm.component.html',
  styleUrls: ['./video-list-item-sm.component.scss']
})
export class VideoListItemSmComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  @Input() data: any;

  @Output() onClick= new EventEmitter();
}
