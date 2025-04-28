import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service'
import { CommonModule, JsonPipe } from '@angular/common';
import { Endpoints } from '@octokit/types';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-additions-list',
  imports: [JsonPipe, TableModule, CommonModule, ButtonModule],
  templateUrl: './additions-list.component.html',
  styleUrl: './additions-list.component.scss'
})
export class AdditionsListComponent implements OnInit {

  public additionsList: Array<any> = [];
  public lastCommit: Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']['data'] | null = null;
  public amIStaff: boolean = false;

  private async getLastCommit() {
    try {
      const commits = await this.GitHubService.getLastCommit();
      this.lastCommit = commits
    } catch {
      this.lastCommit = null;
    }
  }

  public async approve(prId: number) {
    await this.GitHubService.mergePullRequest(prId);
  }

  /**
   * Loads the list.
   */
  async ngOnInit() {
    this.additionsList = (await this.GitHubService.listPullRequests()).data;
    const myPerm = await this.GitHubService.amICollaborator();
    this.amIStaff = myPerm.data.permission === 'admin' || myPerm.data.permission === 'write';
    await this.getLastCommit();
  }

  constructor(private readonly GitHubService: GithubService) {}

}
