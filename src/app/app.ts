import { Component } from '@angular/core';
import { ViewportComponent } from './components/viewport/viewport.component';

@Component({
  selector: 'app-root',
  imports: [ViewportComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
