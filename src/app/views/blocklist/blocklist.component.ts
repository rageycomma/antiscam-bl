import { Component, OnInit } from '@angular/core';
import { BlocklistService } from '../../services/blocklist.service';
import { IBlocklistItem } from '../../interfaces/IBlocklistItem';
import { TableModule } from 'primeng/table';
import { ChipModule } from 'primeng/chip';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cso-blocklist',
  imports: [TableModule, ChipModule, CommonModule],
  templateUrl: './blocklist.component.html',
  styleUrl: './blocklist.component.scss'
})
export class BlocklistComponent implements OnInit {

  /**
   * The list of items which are blocked.
   */
  public blockListItems: Array<IBlocklistItem> = [];

  /**
   * Called when the component is initialised.
   * @returns
   */
  async ngOnInit() {
    this.blockListItems = [];
  }

  /**
   * Creates a new instance of the blocklist component.
   * @param BlockListService
   */
  constructor(private readonly BlockListService: BlocklistService) {}
}
