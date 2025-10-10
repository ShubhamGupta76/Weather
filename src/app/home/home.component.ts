import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { SearchComponent } from '../search/search.component';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, SearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
