import { Routes } from '@angular/router';
import { GithubRedirectComponent } from './views/github-redirect/github-redirect.component';
import { AdditionsListComponent } from './views/additions-list/additions-list.component';
import { BlocklistComponent } from './views/blocklist/blocklist.component';
import { MainPageComponent } from './views/main-page/main-page.component';
import { AddToBlocklistComponent } from './views/add-to-blocklist/add-to-blocklist.component';
import { GettingStartedComponent } from './views/getting-started/getting-started.component';

export const routes: Routes = [{
  path: 'github-return-login',
  component: GithubRedirectComponent
}, {
  path: 'addition-list',
  component: AdditionsListComponent
},{
  path: 'blocklist',
  component: BlocklistComponent
},{
  path: 'add-to-blocklist',
  component: AddToBlocklistComponent
}, {
  path: 'getting-started',
  component: GettingStartedComponent
}, {
  path: '',
  component: MainPageComponent
}];
