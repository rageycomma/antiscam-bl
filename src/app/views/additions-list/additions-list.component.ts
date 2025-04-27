import { Component, OnInit } from '@angular/core';
import { GithubService } from '../../services/github.service'
import { JsonPipe } from '@angular/common';
import { Endpoints } from '@octokit/types';

@Component({
  selector: 'app-additions-list',
  imports: [JsonPipe],
  templateUrl: './additions-list.component.html',
  styleUrl: './additions-list.component.scss'
})
export class AdditionsListComponent implements OnInit {

  public additionsList: Array<any> = [];
  public lastCommit: Endpoints['GET /repos/{owner}/{repo}/commits/{ref}']['response']['data'] | null = null;

  private async getLastCommit() {
    try {
      const commits = await this.GitHubService.getLastCommit();
      this.lastCommit = commits
    } catch {
      this.lastCommit = null;
    }
  }


  async ngOnInit() {
    this.additionsList = await this.GitHubService.listPullRequests();
    await this.getLastCommit();
  }

  constructor(private readonly GitHubService: GithubService) {}

}
