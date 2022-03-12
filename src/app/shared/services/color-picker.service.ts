import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorPickerService {
  constructor() { }


   // Set Color
   setColorScheme(color) {
    const href = '/assets/css/color/' + color + '.css';
    document.getElementById('color').innerHTML = '<link href=' + href + ' rel="stylesheet">';
    }
  }
