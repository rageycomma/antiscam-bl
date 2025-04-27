import { Injectable } from '@angular/core';
import git from 'isomorphic-git';
import LightningFS from '@isomorphic-git/lightning-fs';
import http from 'isomorphic-git/http/web';
import { environment } from '../../environments/environment.development';

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

  constructor() {
    this.LightningFSInst = new LightningFS('fs');
  }
}
