import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { lastValueFrom, Observable, ReplaySubject, Subject } from 'rxjs';
import { Octokit } from '@octokit/core';
import { Endpoints } from '@octokit/types';

import {
  createPullRequest,
} from "octokit-plugin-create-pull-request";
@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private OctoKitInst: any;


  /**
   * When the user has signed in to github, do stuff.
   */
  private onUserGitHubSignIn$: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  /**
   * Gets the access token we retrieved from GitHub.
   */
  public get accessToken(): string {
    return localStorage.getItem('ABL_GITHUB_ACCESS_TOKEN') as string;
  }

  /**
   * Gets the current logged in user from localStorage.
   */
  public get loggedInUser(): Endpoints["GET /user"]["response"]["data"] | null {
    const user = localStorage.getItem('ABL_CURRENT_USER');
    return user === null ? null : JSON.parse(user);
  }

  /**
   * Listen to when the user has signed in to github.
   * @returns
   */
  public onUserGitHubSignIn() {
    return this.onUserGitHubSignIn$;
  }

  /**
   * Inits auth.
   */
  private initOctoKit() {
    const OctoKitExtended = Octokit.plugin(createPullRequest)

    this.OctoKitInst ??= new OctoKitExtended({
      auth: localStorage.getItem('USER_FINE_GRAINED_TOKEN') as string,
    })
  }

  /**
   * Gets the logged in user from GitHub.
   * @returns
   */
  private async getLoggedInUser(): Promise<Endpoints["GET /user"]["response"]["data"]> {
    const response: Endpoints["GET /user"]["response"] = await this.OctoKitInst.request('GET /user');
    return response.data;
  }

  /**
   * Populates the logged in user in localStorage.
   */
  public async setFineGrainedToken(fineGrainedLoginToken: string): Promise<Endpoints["GET /user"]["response"]["data"]> {
    const loginToken: string | null = localStorage.getItem('USER_FINE_GRAINED_TOKEN');

    // If no token exists then we need to populate it.
    if (loginToken === null) {
      localStorage.setItem('USER_FINE_GRAINED_TOKEN', fineGrainedLoginToken);
    }

    // Then get octoKit with that token so we can do our thing.
    this.initOctoKit();

    // Then get the logged in user.
    const loggedInUser = await this.getLoggedInUser();

    // Then populate the user.
    localStorage.setItem('ABL_CURRENT_USER', JSON.stringify(loggedInUser));
    return loggedInUser;
  }

  /**
   * Sets the access token when the code is retrieved via oAuth login.
   * @param code
   */
  public async setAccessToken(code: string) {
    localStorage.setItem('ABL_GITHUB_ACCESS_TOKEN', code);
    this.initOctoKit();
  }

  /**
   * Lists the last commit.
   */
  public async getLastCommit(): Promise<Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"]> {
    this.initOctoKit();
    const commit: Endpoints["GET /repos/{owner}/{repo}/commits"]["response"] = await this.OctoKitInst.request('GET /repos/{owner}/{repo}/commits', {
      owner: environment.REPO_OWNER,
      repo: environment.REPO_NAME,
      per_page: 1,
    });
    return commit.data?.[0];
  }


  /**
   * Lists all pull requests so we can see which additions have been created.
   * @returns
   */
  public async listPullRequests() {
    this.initOctoKit();
    return this.OctoKitInst.request('GET /repos/{owner}/{repo}/pulls', {
      owner: environment.REPO_OWNER,
      repo: environment.REPO_NAME,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  /**
   * Creates a pull request!
   * @param title
   * @param desc
   * @param commitText
   * @param changes
   * @returns
   */
  public async createPullRequest(
    title: string,
    desc: string,
    prBranch: string,
    changes: Array<any>
  ) {
    this.initOctoKit();
    return this.OctoKitInst.createPullRequest({
      owner: environment.REPO_OWNER,
      repo: environment.REPO_NAME,
      title,
      head: prBranch,
      body: desc,
      update: false,
      forceFork: true,
      changes
    })
  }

  public async isUserCollaborator(username: string) {
    this.initOctoKit();
    return this.OctoKitInst.request('GET /repos/{owner}/{repo}/collaborators/{username}/permission', {
      owner: environment.REPO_OWNER,
      repo: environment.REPO_NAME,
      username,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  /**
   * Checks if the user provided is a collaborator for the Git repo used for this blocklist.
   * @returns
   */
  public async amICollaborator() {
    this.initOctoKit();
    const me = await this.OctoKitInst.request('GET /user');
    return this.isUserCollaborator(me.data?.login);
  }

  /**
   * Merges a PR.
   * @param prId
   * @returns
   */
  public async mergePullRequest(prId: number) {
    const me = await this.OctoKitInst.request('GET /user');
    return this.OctoKitInst.request('PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge', {
      owner: environment.REPO_OWNER,
      repo: environment.REPO_NAME,
      pull_number: prId,
      commit_title: `PR Merged by ${me.data.login}`,
      commit_message: `PR Merged by ${me.data.login}`
    });
  }



  /**
   * Creates a new instance of the github login service.
   * @param HttpClient
   */
  constructor(private readonly HttpClient: HttpClient) {

  }
}
