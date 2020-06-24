import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  baseURL = 'http://localhost:3000'

  constructor(public httpClient: HttpClient) { }

  async sendCode(code) {
    const response = await this.httpClient.post(`${this.baseURL}/parser`, code).toPromise()
    return response
  }

}
