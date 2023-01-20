import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, shareReplay, Subject, Subscription } from 'rxjs';
import { ContestsI } from '../Contests';
import { SavedContestsService } from './saved-contests.service';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  private apiUrl = 'https://kontests.net/api/v1';
  private contestData: Subject<ContestsI[]> = new Subject<ContestsI[]>();
  // Save our saved contests to check against our incoming api data
  private savedContests: ContestsI[] = [];
  private savedSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private savedService: SavedContestsService
  ) {
    // Listens to our saved data array with a subscription, not sure if its working
    this.savedSubscription = this.savedService
      .watchContests()
      .subscribe((contests) => {
        this.savedContests = contests;
      });
    //Gets our inital contests, I think this may be why the subscription was not working on the contest.component
    //when we were on the save page
    this.refreshContests();
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  /**
   * Refreshes the contests data based off the site changing in the function call
   * Updates the contestsData subject, and checks our data against the saved data
   * @param site - The site to query contest from
   * @returns nothing
   */
  refreshContests(site: string = 'all'): void {
    //Prevents us from making multiple API calls with multiple subscribers
    // We render two different tables, only one API call between them
    this.http
      .get<ContestsI[]>(`${this.apiUrl}/${site}`)
      .pipe(
        map((contests, i) => {
          

          contests.forEach((contest) => {
            //Correctly formats our incoming data
            contest.start_time = new Date(contest.start_time);
            contest.end_time = new Date(contest.end_time);
            contest.duration = parseInt(contest.duration as string);

            //Check if it is in our saved contests array
              for (let c of this.savedContests) {
                //If we find a saved contests
                if (c.name === contest.name) {
                  contest.saved = true;

                  //Update our saved contests when they start
                  c.status !== contest.status &&
                    this.savedService.updateSaved(contest);
                  break;
                }
              }
            
            !contest.saved && (contest.saved = false);
          });
          return contests;
        }),
        //Used to prevent multiple API calls from multiple subscribers
        shareReplay()
      )
      .subscribe(
        (contests) => {
          //Updates our Subject with the new contests
          this.contestData.next(contests);
        },
        (err) => console.error(err)
      );
  }

  watchContests(): Observable<ContestsI[]> {
    return this.contestData.asObservable();
  }
  getSaved():Observable<ContestsI[]>{
    return this.savedService.getSaved()
  }
}
