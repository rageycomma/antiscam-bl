import { Injectable } from '@angular/core';
import { IBlocklistItem } from '../interfaces/IBlocklistItem';
import { GitService } from './git.service';

@Injectable({
  providedIn: 'root'
})
export class BlocklistService {

  /**
   * The DNS blocklist.
   */
  public ipDnsBlocklist: Array<IBlocklistItem> = [];

  private createNestedFolderList(prefix: string, ipText: string, ipVersion: 'ipv4' | 'ipv6') {
    const split = ipVersion === 'ipv4' ? '.' : ':';
    const splitByVer = ipText.split(split);
    const totalSplits = splitByVer.length;
    return new Array(splitByVer.length).fill(splitByVer)
      .reduce((iter, frag, idx) => {
        iter.push(
          `${prefix}${frag.slice(0, totalSplits - idx).join(split)}`
        );
        return iter;
      }, []);
  }

  /**
   * Ensures that an IP blocklist exists and is partitioned.
   * @param ipVersion
   * @param ipAddress
   */
  private async ensureIPPartition(ipAddress: string, ipVersion: 'ipv4' | 'ipv6' = 'ipv4') {
    const allPathsToEnsure = this.createNestedFolderList(`/blocklist/blocklist/DNS/${ipVersion}/`, ipAddress, ipVersion);
    const folderResult = await this.GitService.createFolders(allPathsToEnsure);

    const x = 'g';
  }

  public async addItemToBlocklist(item: IBlocklistItem) {
    const ipv4Paths = !item.ipv4 ? [] : this.ensureIPPartition(item.ipv4, 'ipv4');
    const ipv6Paths = !item.ipv6 ? [] : this.ensureIPPartition(item.ipv6, 'ipv6');
    const x = 'g';

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
