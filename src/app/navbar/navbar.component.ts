import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Calendar } from '../calendar/calendar';
import { environment } from '../../environments/environment';

interface WeatherResponse {
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
  name: string;
}

interface StateTemp {
  state: string;
  city: string;
  temperature: number;
  icon: string;
  loading: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule, Calendar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  stateTemps: StateTemp[] = [
    { state: 'Delhi', city: 'Delhi', temperature: 0, icon: '', loading: true },
    { state: 'Mumbai', city: 'Mumbai', temperature: 0, icon: '', loading: true },
    { state: 'Bangalore', city: 'Bangalore', temperature: 0, icon: '', loading: true },
    { state: 'Chennai', city: 'Chennai', temperature: 0, icon: '', loading: true },
    { state: 'Kolkata', city: 'Kolkata', temperature: 0, icon: '', loading: true }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchStateTemperatures();
  }

  fetchStateTemperatures() {
    this.stateTemps.forEach((stateData, index) => {
      this.http.get<WeatherResponse>(`${environment.apiBaseUrl}/api/weather/${stateData.city}`)
        .subscribe({
          next: (data) => {
            this.stateTemps[index].temperature = Math.round(data.main.temp);
            this.stateTemps[index].icon = data.weather[0].icon;
            this.stateTemps[index].loading = false;
          },
          error: (err) => {
            this.stateTemps[index].loading = false;
            console.error(`Error fetching weather for ${stateData.city}:`, err);
          }
        });
    });
  }
}
