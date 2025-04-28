import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment.development';
import { RouterModule } from '@angular/router';
import { GithubService } from '../../services/github.service';
import { Endpoints } from '@octokit/types';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixAddCircleFill, remixListUnordered, remixShieldStarFill } from '@ng-icons/remixicon';

@Component({
  selector: 'abl-header',
  imports: [ToolbarModule, ButtonModule, RouterModule, CommonModule, MenubarModule, NgIcon],
  providers: [provideIcons({ remixListUnordered, remixAddCircleFill })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  /**
   * Is the current user logged in?
   */
  public IsLoggedIn: boolean = false;

  public amIStaff: boolean = false;

  /**
   * The logged in user.
   */
  public LoggedInUser: Endpoints["GET /user"]["response"]["data"] | null = null;

  public HeaderItems: Array<MenuItem> = [{
    label: 'Blocklist',
    icon: 'remixListUnordered',
    routerLink: 'blocklist'
  }, {
    label: 'Pending',
    icon: 'remixListUnordered',
    routerLink: 'addition-list'
  }, {
    label: 'Add IP Address',
    icon: 'remixAddCircleFill',
    routerLink: 'add-to-blocklist'
  }]

  /**
   * The URL which allows the user to log into GitHub.
   */
  public get GitHubLoginURL(): string {
    return `https://github.com/login/oauth/authorize?client_id=${environment.CLIENT_ID}`;
  }

  async ngOnInit() {
    await this.GithubService.populateLoggedInUser();
    this.LoggedInUser = this.GithubService.loggedInUser;
    this.IsLoggedIn = !!this.GithubService.loggedInUser;

    const myPerm = await this.GithubService.amICollaborator();
    this.amIStaff = myPerm.data.permission === 'admin' || myPerm.data.permission === 'write';
  }

  constructor(private readonly GithubService: GithubService) {}


}
