import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Input,
} from '@angular/core';
import { ContestsI } from 'src/app/Contests';
import { ContestService } from 'src/app/services/contest.service';
import {
  SortableHeadDirective,
  SortEvent,
} from 'src/app/directives/sortable-head.directive';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SavedContestsService } from 'src/app/services/saved-contests.service';

// Compare values and return an integer
const compare = (v1: any, v2: any) => {
  if (v1 && v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }
  return 0;
};

@Component({
  selector: 'contests-table',
  templateUrl: './contests.component.html',
  styleUrls: ['./contests.component.css'],
})
export class ContestsComponent implements OnInit {
  private contests: ContestsI[] = [];

  //Used to listen to changes in the contest array from the services, still dont
  //understand how it wokrs completely
  private subscription: Subscription;

  // Input for what will be displayed in the table
  @Input() type: 'upcoming' | 'ongoing' = 'upcoming';

  //For pagination
  contestsDisplay: ContestsI[] = [];
  collectionSize: number = 0;
  page: number = 1;
  pageSize: number = 10;

  //From bootstrap not sure how it will work
  @ViewChildren(SortableHeadDirective)
  headers!: QueryList<SortableHeadDirective>;

  constructor(
    private contestService: ContestService,
    private savedService: SavedContestsService,
    private router: Router
  ) {

    //Listening for changes in the contest service when on the main page, getting favorites when on the saved page
    // tried to make it listen for changes on save as well, but didnt work
    this.subscription = this.contestService[
      this.router.url === '/saved' ? 'getSaved' : 'watchContests'
    ]().subscribe((contests) => {
      //Render the contests in our table based on it being upcoming, or is currently active
      this.contests =
        this.type === 'upcoming'
          ? contests.filter((contest) => contest.status !== 'CODING')
          : contests.filter((contest) => contest.status === 'CODING');

      this.collectionSize = this.contests.length;

      //refreshes the table with our pagination
      this.refreshTable();
    });
  }

  ngOnInit(): void {}

  //Refreshes the table whenever we update the page size, or sort
  refreshTable() {
    this.contestsDisplay = this.contests.slice(
      (this.page - 1) * this.pageSize,
      (this.page - 1) * this.pageSize + this.pageSize
    );
  }

  //Sort columns using Sortable Header Directive form bootstrap
  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    // sorting columns through original contests data
    if (direction === '' || column === '') {
      this.contests = this.contests;
    } else {
      this.contests = [...this.contests].sort((a, b) => {
        const res = compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
    //Used contestsDisplay to keep original dataset intact
    this.contestsDisplay = this.contests;
    //Refresh the tables after making the changes
    this.refreshTable();
  }

  //Toggles our saved icon 
  toggleSave(contest: ContestsI) {
    //Do this first to have saved be true when posting
    contest.saved = !contest.saved;

    if (contest.saved) {
      //save the contest if it wasnt saved
      this.savedService.saveContest(contest);
    } else {
      //Remove the saved contest 
      this.savedService.removeSaved(contest.name);

      //If we are on the saved page then filter out the removed contest from our display
      if (this.router.url === '/saved') {
        this.contestsDisplay = this.contestsDisplay.filter(
          (c) => c.name !== contest.name
          );
        }
      }
  }
}


/*
 ## contests.componenet
- Renders the contest table and its pagination 
 - Uses a subscription to listen to the contest.service Subject (sends a get requests to the KnotestAPI and returns a Subject) when on the main page 
- When on the '/saved' page utilizes the 'saved-contest.service' to retrieve saved contests instead of pinging the KontestAPI
- Input - type from 'tables.component' used to devide if the table will display ongoing, or upcoming contests.
- the 'th' use the sortable directive, based off bootstrap's documentation 
- utilizes bootstrap's pagination module to set up the pagination
- stores the toggleSave function passed to 'contest-item.component' to toggle saved contest


*/
