import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { ContestsI } from '../Contests';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SavedContestsService {
  private apiUrl: string = environment.server;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private savedContests: Subject<ContestsI[]> = new Subject();
  // used to create an array that can be returned with our subject 
  private contests!: ContestsI[];

  constructor(private http: HttpClient) {
    //initilizes the data
    this.getSaved();
  }

  //returns ou subject
  watchContests(): Observable<ContestsI[]> {
    return this.savedContests.asObservable();
  }

  //Get the saved contests
  getSaved(name: string = ''): Observable<ContestsI[]> {
    const res = this.http.get<ContestsI[]>(this.apiUrl);
    res.subscribe((contests) => {
      this.contests = contests;
      this.savedContests.next(contests);
    });
    return res;
  }
  //Add a saved contest
  saveContest(contest: ContestsI) {
    this.http.post(this.apiUrl, contest, this.httpOptions).subscribe(() => {
      this.contests.push(contest);
      this.savedContests.next(this.contests);
    });
  }
  //Update the saved contest
  updateSaved(contest: ContestsI) {
    this.http
      .put(`${this.apiUrl}/${contest.name}`, contest, this.httpOptions)
      .subscribe(() => {
        for (let c of this.contests) {
          if (contest.name === c.name) {
            c = contest;
            break;
          }
        }
        this.savedContests.next(this.contests);
      });
  }
  // Remove the saved contest
  removeSaved(name: string) {
    this.http.delete(`${this.apiUrl}/${name}`).subscribe(() => {
      this.contests = this.contests.filter((c) => c.name !== name);
      this.savedContests.next(this.contests);
    });
  }
}
