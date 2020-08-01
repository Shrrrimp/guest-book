import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }

  getAvatar(imgSrc: string): string {
    if (imgSrc === 'https://guest-book.naveksoft.com/storage/') {
      return 'assets/images/no_avatar.png';
    }

    return imgSrc;
  }
}
