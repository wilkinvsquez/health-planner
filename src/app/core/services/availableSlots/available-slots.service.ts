import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestAvailableSlots } from '../../interfaces/RequestAvailableSlots';
import { Response } from '../../interfaces/Response';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AvailableSlotsService {

  constructor(private http: HttpClient) { }

  async getAvailableSlots(requestBody: RequestAvailableSlots) {
    const url = `${environment.functionsBaseUrl}/availability`;
    let response: any = await firstValueFrom(this.http.post<Response>(url, requestBody));
    console.log('response: ', response);

    if (response && response.status === 200) {
      return { success: true, data: response.data, message: response.message } as Response;
    } else {
      return { success: false, data: response.data, message: response.message } as Response;
    }
  }

}
