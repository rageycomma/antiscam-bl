export interface IBlocklistItemEvidence {
  gh_user: string;
  media_location_url: string;
  notes: string;
  date_added: string;
  date_modified: string;
}

export interface IBlocklistItemNote {
  gh_user: string;
  title: string;
  description: string;
}

export interface IBlocklistItem {
  id: string;
  ipv4: string;
  ipv6?: string;
  hostname: string;
  isp_name: string;
  country: string;
  lat: number;
  lon: number;
  added_by_gh_user: string;
  approved_by_gh_user: string;
  approval_message: string;
  categories: Array<string>;
  evidence: Array<IBlocklistItemEvidence>;
  notes: Array<IBlocklistItemNote>
  date_added: string;
  date_modified: string;
}
