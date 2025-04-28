import { Injectable } from '@angular/core';
import git from 'isomorphic-git';
import LightningFS from '@isomorphic-git/lightning-fs';
import http from 'isomorphic-git/http/web';
import { environment } from '../../environments/environment.development';
import { GithubService } from './github.service';

@Injectable({
  providedIn: 'root'
})
export class GitService {

  /**
   * Used for loading git files into memory.
   */
  public LightningFSInst!: LightningFS;

  /**
   * Clones a repository into a virtual FS. This is why we have a separate repo --
   * too much shit is going to make this slow.
   * @returns
   */
  public async cloneRepo() {
    await git.init({
      fs: this.LightningFSInst,
      dir: '/blocklist',
    })
    return await git.clone({
      http,
      dir: '/blocklist',
      fs: this.LightningFSInst,
      url: `https://github.com/${environment.REPO_OWNER}/${environment.REPO_NAME}`,
      corsProxy: 'https://proxy.corsfix.com/?',
    });
  }

  /**
   * Creates a git branch for the PR.
   */
  public createBranch(branchName: string) {
    return git.branch({
      fs: this.LightningFSInst,
      dir: '/blocklist',
      ref: branchName,
    });
  }

  public checkoutBranch(branchName: string) {
    return git.checkout({
      fs: this.LightningFSInst,
      dir: '/blocklist',
      ref: branchName
    });
  }

  /**
   * Pushes changes on current branch.
   */
  public pushBranch() {
    return git.push({
      http,
      fs: this.LightningFSInst,
      dir: '/blocklist',
      url: `https://github.com/${environment.REPO_OWNER}/${environment.REPO_NAME}`,
      corsProxy: 'https://proxy.corsfix.com/?',
      onAuth: () => ({ username: this.GithubService.loggedInUser?.login, password: this.GithubService.accessToken })
    })
  }

  /**
   * Lists files in the git repository directory.
   * @param dir
   * @returns
   */
  public listFiles(dir: string) {
    return this.LightningFSInst.promises.readdir(dir);
  }

  public createFolders(paths: Array<string>) {
    return Promise.allSettled(
      paths.map(path => this.LightningFSInst.promises.mkdir(path))
    )
  }

  /**
   * Puts a file into the LightningFS instance.
   * @param path
   * @param contents
   * @returns
   */
  public putGitFile(path: string, contents: string) {
    return this.LightningFSInst.promises.writeFile(path, contents);
  }

  /**
   * Does the file exist in the git repository?
   * @param filePath
   * @returns
   */
  public gitFileExists(filePath: string) {
    return this.LightningFSInst.promises.stat(filePath);
  }

  public getGitFile(filePath: string) {
    return this.LightningFSInst.promises.readFile(filePath);
  }

  constructor(private readonly GithubService: GithubService) {
    this.LightningFSInst = new LightningFS('fs');
  }
}
