import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getAvatar(imgSrc: string): string {
    if (imgSrc === `${environment.apiUrl}storage/`) {
      return 'assets/images/no_avatar.png';
    }

    return imgSrc;
  }
}
