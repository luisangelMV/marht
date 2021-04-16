import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.sass']
})
export class RecordComponent implements OnInit {

  id = '';

  constructor(
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.id = params['id'] || null;

    });
  }

}
