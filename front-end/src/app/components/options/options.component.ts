import { Component, OnInit } from '@angular/core';
import { ContestService } from 'src/app/services/contest.service';
import { SiteService } from 'src/app/services/site.service';
import {Router} from '@angular/router'

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css'],
})
export class OptionsComponent implements OnInit {
  sites: string[] = [];
  currSite:string = 'all'
  constructor(private siteService: SiteService,private contestService:ContestService, private router: Router) {}

  ngOnInit(): void {
    //get the sites available
    this.siteService.getSites().subscribe((sites) => {
      sites.forEach((site) => {
        this.sites.push(site[1]);
      });
    });
  }

  // Refreshes the contest when we change our site selection
  getSiteContests(){
    this.contestService.refreshContests(this.currSite);
  }

  hasRouter(route:'/' | '/saved'){
    return this.router.url === route
  }
}
