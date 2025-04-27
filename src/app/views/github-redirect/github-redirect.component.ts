import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../../services/github.service';

@Component({
  selector: 'app-github-redirect',
  imports: [],
  templateUrl: './github-redirect.component.html',
  styleUrl: './github-redirect.component.scss'
})
export class GithubRedirectComponent implements OnInit {

  public GitHubToken!: string;

  async ngOnInit() {
    // Sets the auth so we can octowhateveritscalled
    await this.GithubService.setAccessToken(this.GitHubToken);

    // Store logged in user in localStorage.
    await this.GithubService.populateLoggedInUser();
    this.Router.navigate(['/'])
  }

  constructor(
    private readonly Router: Router,
    private readonly Route: ActivatedRoute,
    private GithubService: GithubService
  ) {
    this.Route.queryParams.subscribe((param: any) => {
      this.GitHubToken = param.code;
    })
  }
}
