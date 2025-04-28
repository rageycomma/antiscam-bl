import { Component } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { FluidModule } from 'primeng/fluid';
import { MessageModule } from 'primeng/message';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { IpApiService } from '../../services/ip-api.service';
import { CommonModule } from '@angular/common';
import { GithubService } from '../../services/github.service';
import { v4 as uuidv4 } from 'uuid';
import { BlocklistService } from '../../services/blocklist.service';
import { IBlocklistItem } from '../../interfaces/IBlocklistItem';

@Component({
  selector: 'app-add-to-blocklist',
  imports: [InputTextModule, FluidModule, TextareaModule, MessageModule, ReactiveFormsModule, MultiSelectModule, ButtonModule, CommonModule, RadioButtonModule],
  templateUrl: './add-to-blocklist.component.html',
  styleUrl: './add-to-blocklist.component.scss'
})
export class AddToBlocklistComponent {

  /**
   * The IPv4 lookup
   */
  public ipResult: any | null = null;

  public name: FormControl = new FormControl(null, [Validators.required, Validators.minLength(1)]);
  public categories: FormControl = new FormControl([], [Validators.minLength(1)]);
  public ipVersion: FormControl = new FormControl(4);
  public ipv4: FormControl = new FormControl(null);
  public ipv6: FormControl = new FormControl(null);
  public lat: FormControl = new FormControl(null);
  public lon: FormControl = new FormControl(null);
  public initialNote: FormControl = new FormControl(null);

  /**
   * The type of scam that is being performed.
   */
  public displayCategories: Array<{name: string; value: string; }> = [{
    name: 'Tech Support Scam',
    value: 'tech_support_scam'
  }, {
    name: 'Banking Scam',
    value: 'banking_scam'
  }];

  /**
   * Form for creating a new blocklist item.
   */
  public addToBlocklistForm: FormGroup = new FormGroup({
    ipVersion: this.ipVersion,
    name: this.name,
    ipv4: this.ipv4,
    ipv6: this.ipv6,
    lat: this.lat,
    lon: this.lon,
    categories: this.categories,
    initialNote: this.initialNote
  });

  /**
   * Performs a lookup of an IP address
   * @param ipValue
   */
  private async doLookupIP(ipValue: string) {
    try {
      const result: any = await this.IpApiService.lookupIP(ipValue);
      this.ipResult = result;

      if (result?.status !== 'success') {
        this.ipResult = null;
      }
    } catch {
      this.ipResult = null;
    }
  }

  public async onLookupIPv4() {
    await this.doLookupIP(this.ipv4.value);
  }

  public async onLookupIPv6() {
    await this.doLookupIP(this.ipv6.value);
  }

  /**
   * Adds an item and then preps a PR for the item a person has added.
   */
  public async doAddItem() {
    const user = this.GithubService.loggedInUser;
    const currDate = new Date().toISOString();

    const constructedObject: IBlocklistItem = {
      id: uuidv4(),
      evidence: [],
      added_by_gh_user: user?.html_url ?? '',
      ipv4: this.ipv4.value ?? null,
      ipv6: this.ipv6.value ?? null,
      lat: this.ipResult?.lat,
      lon: this.ipResult?.lon,
      notes: [],
      categories: this.categories.value.map((cat: any) => cat.value),
      date_added: currDate,
      date_modified: currDate,
      hostname: '',
      isp_name: '',
      country: '',
      approved_by_gh_user: '',
      approval_message: ''
    };

    await this.BlocklistService.addItemToBlocklist(constructedObject);
  }

  /**
   * Creates a new instance of the add-to-blocklist component.
   * @param IpApiService
   */
  constructor(
    private readonly IpApiService: IpApiService,
    private readonly GithubService: GithubService,
    private readonly BlocklistService: BlocklistService
  ) {
    this.ipv4.addValidators(Validators.required);

    this.ipVersion.events.subscribe((voof: any) => {
        if (voof.source.value === '6') {
          this.ipv4.setValidators([]);
          this.ipv4.setValue(null);
          this.ipv6.setValidators(Validators.required)
        } else {
          this.ipv6.setValidators([]);
          this.ipv6.setValue(null);
          this.ipv4.setValidators(Validators.required)
        }
    });
  }

}
