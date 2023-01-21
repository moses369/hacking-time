import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContestsI } from 'src/app/Contests';
import { faBookmark as faNotSaved } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faSaved } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';

@Component({
  selector: '[contest-item]',
  templateUrl: './contest-item.component.html',
  styleUrls: ['./contest-item.component.css'],
})
export class ContestItemComponent implements OnInit {
  @Input() contest!: ContestsI;
  @Output() onToggleSave: EventEmitter<ContestsI> = new EventEmitter();
  currDate: Date = new Date();

  faNotSaved: IconDefinition = faNotSaved;
  faSaved: IconDefinition = faSaved;
  constructor() {}

  ngOnInit(): void {}

  //Toggle the save button for the contest
  onToggle() {
    this.onToggleSave.emit(this.contest);
  }
}

/* 
  ## contest-item
  - Renders the 'td' for each contest
  - Inputs - ('contest' from 'contests.component') the contest object to display 
  - Outputs - ('onToggle' to 'contests.componenet') allows the us to toggle the saved property of the contest
*/
