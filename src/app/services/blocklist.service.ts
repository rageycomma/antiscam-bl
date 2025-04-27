import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { firstValueFrom } from 'rxjs';
import { IBlocklistItem } from '../interfaces/IBlocklistItem';

@Injectable({
  providedIn: 'root'
})
export class BlocklistService {
  /**
   * URL template used to reference URLs which include JSON content.
   */
  private static URL_TEMPLATE = 'https://raw.githubusercontent.com/$OWNER/$REPO/refs/heads/$BRANCH_NAME/IPBLOCKLIST.json'

  /**
   * Generates a raw file URL for a given branch.
   * @param branchName Git branch name
   * @returns URL for raw content for a given branch.
   */
  private generateRawURLForBranch(branchName: string) {
    return BlocklistService.URL_TEMPLATE
      .replace('$OWNER', environment.REPO_OWNER)
      .replace('$REPO', environment.REPO_NAME)
      .replace('$BRANCH_NAME', branchName);
  }

  /**
   * Gets a blocklist from a given branch so its summary and other info
   * can be generated from it.
   * @param branchName Git branch name
   */
  public getBlocklistForBranch(branchName: string): Promise<Array<IBlocklistItem>> {
    return firstValueFrom(
      this.HttpClient.get<Array<IBlocklistItem>>(
        this.generateRawURLForBranch(branchName),
        {
          responseType: 'json'
        }
      )
    );
  }

  constructor(private readonly HttpClient: HttpClient) { }
}
