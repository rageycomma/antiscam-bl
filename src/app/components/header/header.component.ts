import { Component, OnInit } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment.development';
import { Router, RouterModule } from '@angular/router';
import { GithubService } from '../../services/github.service';
import { Endpoints } from '@octokit/types';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { NgIcon, provideIcons } from '@ng-icons/core'
import { remixAddCircleFill, remixComputerFill, remixShieldStarFill, remixUserCommunityFill, remixUserStarFill } from '@ng-icons/remixicon';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'abl-header',
  imports: [ToolbarModule, ButtonModule, RouterModule, CommonModule, MenubarModule, NgIcon, AvatarModule, DialogModule, InputTextModule, ReactiveFormsModule],
  providers: [provideIcons({ remixUserCommunityFill, remixAddCircleFill, remixShieldStarFill, remixComputerFill, remixUserStarFill })],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {

  public accessToken: FormControl = new FormControl(null, [Validators.required]);

  public accessTokenForm: FormGroup = new FormGroup({
    accessToken: this.accessToken
  });

  /**
   * The logged in user.
   */
  public get LoggedInUser(): Endpoints["GET /user"]["response"]["data"] | null {
    return this.GithubService.loggedInUser;
  }

  /**
   * Is the current user logged in?
   */
  public get IsLoggedIn(): boolean {
    return !!this.GithubService.loggedInUser;
  }

  public amIStaff: boolean = false;

  /**
   * User has to put in access token in as oauth is broken via github.
   */
  public showAccessTokenInput: boolean = false;

  public repoName: string = environment.REPO_NAME;
  public HeaderItems: Array<MenuItem> = [{
    label: 'Blocklists',
    icon: 'remixShieldStarFill',
    items: [{
      label: 'IP Blocklist',
      routerLink: 'blocklist'
    }]
  }, {
    label: 'Pending additions',
    icon: 'remixUserCommunityFill',
    routerLink: 'addition-list'
  }];

  /**
   * The URL which allows the user to log into GitHub.
   */
  public get GitHubLoginURL(): string {
    return `https://github.com/login/oauth/authorize?client_id=${environment.CLIENT_ID}`;
  }

  public get GitHubRepoLink(): string {
    return `https://github.com/${environment.REPO_OWNER}/${environment.REPO_NAME}/fork`;
  }

  /**
   * Populates the user's sign in within the header component.
   */
  private async populateUserGithubSignIn() {
    const myPerm = await this.GithubService.amICollaborator();
    this.amIStaff = myPerm.data.permission === 'admin' || myPerm.data.permission === 'write';
  }

  /**
   * Saves the access token to localstorage so we can use it again.
   */
  public async saveAccessToken() {
    await this.GithubService.setFineGrainedToken(this.accessToken.value);
    const myPerm = await this.GithubService.amICollaborator();
    this.amIStaff = myPerm.data.permission === 'admin' || myPerm.data.permission === 'write';
    this.showAccessTokenInput = false;
  }

  public showDialog() {
    this.showAccessTokenInput = true;
  }


  private populateStaffItems () {
    if (this.IsLoggedIn) {
      this.HeaderItems = [
        ...this.HeaderItems,
        {
          label: 'Add',
          icon: 'remixAddCircleFill',
          items: [{
            label: 'Bad IP Address',
            routerLink: 'add-to-blocklist'
          }]
        }
      ]
    }
  }
  
  async ngOnInit() {
    if (this.IsLoggedIn) {
      const myPerm = await this.GithubService.amICollaborator();
      this.amIStaff = myPerm.data.permission === 'admin' || myPerm.data.permission === 'write';
      this.populateStaffItems();
    } else {
      this.showAccessTokenInput = true;
    }
  }

  constructor(
    private readonly GithubService: GithubService
  ) {

  }


}
