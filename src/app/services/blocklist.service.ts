import { Injectable } from '@angular/core';
import { firstValueFrom, map, of, ReplaySubject } from 'rxjs';
import { IBlocklistItem } from '../interfaces/IBlocklistItem';
import { GitService } from './git.service';

@Injectable({
  providedIn: 'root'
})
export class BlocklistService {

  /**
   * When the init completes, tell everything it's ready to go.
   */
  public onInitCompleted: ReplaySubject<boolean> = new ReplaySubject<boolean>();

  /**
   * The DNS blocklist.
   */
  private ipDnsBlocklist: Array<IBlocklistItem> = [];

  /**
   * Gets the IP blocklist once loaded
   * @returns
   */
  public getIPBlocklist() {
    return firstValueFrom(
      this.onInitCompleted.pipe(
        map(() => {
          return of(this.ipDnsBlocklist)
        })
      )
    )
  }

  /**
   * Initialises the git repo and gets the blocklist file.
   */
  private async initGitRepo() {
    // Clone the repo and get the contents locally
    await this.GitService.cloneRepo();

    // Gets the blocklist file as string.
    const blocklistFile = (await this.GitService.getGitFile('/blocklist/blocklist/DNS/blocklist.json')).toString();
    this.ipDnsBlocklist = JSON.parse(blocklistFile);

    // When the init completes, tell subscribers that's the case so they know when
    // the contents of the blocklist can be/are updated
    this.onInitCompleted.next(true);
  }

  private init() {
    (async () => {
      await this.initGitRepo();
    })().then(() => {}).catch((err) => {});
  }

  /**
   * Creates a new instance of the GitService.
   * @param GitService
   */
  constructor(private readonly GitService: GitService) {
    this.init();
  }
}
