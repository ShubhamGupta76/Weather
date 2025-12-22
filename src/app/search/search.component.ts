import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name: string;
}

@Component({
  selector: 'app-search',
  imports: [FormsModule, CommonModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  city: string = '';
  weatherData: WeatherResponse | null = null;
  error: string = '';

  constructor(private http: HttpClient) {}

  searchWeather() {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }
    this.error = '';
    this.http.get<WeatherResponse>(`${environment.apiBaseUrl}/api/weather/${this.city}`)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
        },
        error: (err) => {
          this.error = 'Failed to fetch weather data. Please try again.';
          console.error(err);
        }
      });
  }
}
