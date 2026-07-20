import { Component, signal } from '@angular/core';
import { Viewport } from "./viewport/viewport";

@Component({
  selector: 'app-root',
  imports: [Viewport],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
