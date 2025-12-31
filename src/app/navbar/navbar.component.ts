import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Calendar } from '../calendar/calendar';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, Calendar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
}