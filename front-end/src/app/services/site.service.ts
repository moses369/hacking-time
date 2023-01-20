import { Injectable } from '@angular/core';
import { HttpClient,  } from '@angular/common/http';
import {  Observable,  } from 'rxjs';
import { Site } from '../Site';
@Injectable({
  providedIn: 'root'
})
export class SiteService {
  private apiUrl = 'https://kontests.net/api/v1/sites';

  constructor(private http:HttpClient) { }
  //Gets all the sites available with the kontests API
  getSites(): Observable<Site[]>{
    return this.http.get<Site[]>(this.apiUrl)
  }
}
