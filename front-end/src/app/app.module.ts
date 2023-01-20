import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http'
import { NgbModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { OptionsComponent } from './components/options/options.component';
import { ContestsComponent } from './components/contests/contests.component';
import { SortableHeadDirective } from './directives/sortable-head.directive';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { ContestItemComponent } from './components/contest-item/contest-item.component';
import { SavedContestsService } from './services/saved-contests.service';
import { TablesComponent } from './components/tables/tables.component';

const routes:Routes = [
  {path:'', component:TablesComponent},
  {path:'saved', component:TablesComponent},
]


@NgModule({
  declarations: [
    AppComponent,
    OptionsComponent,
    ContestsComponent,
    SortableHeadDirective,
    FormatTimePipe,
    ContestItemComponent,
    TablesComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    FontAwesomeModule,
    RouterModule.forRoot(routes)
  ],
  providers: [SavedContestsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
