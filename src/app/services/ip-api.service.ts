import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IpApiService {

  public lookupIP(ipAddress: string) {
    return firstValueFrom(
      this.HttpClient.get(`http://ip-api.com/json/${ipAddress}`)
    );
  }

  constructor(private readonly HttpClient: HttpClient) { }
}
