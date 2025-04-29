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
    this.Router.navigate(['/']) // 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
  }

  constructor(
    private readonly Router: Router,
    private readonly Route: ActivatedRoute,
  ) {
    this.Route.queryParams.subscribe((param: any) => {
      this.GitHubToken = param.code;
    })
  }
}
