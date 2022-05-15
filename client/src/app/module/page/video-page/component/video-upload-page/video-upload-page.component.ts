import { Component, OnInit } from '@angular/core';
import { CoreService } from '../../../../../service/core.service';

@Component({
  selector: 'app-video-upload-page',
  templateUrl: './video-upload-page.component.html',
  styleUrls: ['./video-upload-page.component.scss']
})
export class VideoUploadPageComponent implements OnInit {

  constructor(public _core: CoreService) { }

  ngOnInit() {
  }


}
