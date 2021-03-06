import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './helpers/auth.guard';
import { NewsComponent } from './components/news/news.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':username', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: ':username/news', component: NewsComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
