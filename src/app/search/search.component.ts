import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

interface WeatherResponse {
  main: {
    temp: number;
    feels_like?: number;
    temp_min?: number;
    temp_max?: number;
    humidity: number;
    pressure?: number;
  };
  weather: {
    description: string;
    icon: string;
  }[];
  name?: string;
  dt: number;
  dt_txt?: string;
  wind?: {
    speed: number;
  };
}

interface ForecastResponse {
  list: WeatherResponse[];
  city: {
    name: string;
    country: string;
  };
}

interface HistoricalWeather {
  time: string;
  date: string;
  temperature: number;
  description: string;
  icon: string;
  humidity: number;
  type: 'past' | 'current' | 'future';
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
  forecastData: WeatherResponse[] = [];
  historicalWeather: HistoricalWeather[] = [];
  error: string = '';
  loading: boolean = false;
  activeTab: 'current' | 'timeline' = 'current';

  constructor(private http: HttpClient) {}

  searchWeather() {
    if (!this.city.trim()) {
      this.error = 'Please enter a city name';
      return;
    }
    this.error = '';
    this.loading = true;
    this.weatherData = null;
    this.forecastData = [];
    this.historicalWeather = [];

    // Fetch current weather
    this.http.get<WeatherResponse>(`${environment.apiBaseUrl}/api/weather/${this.city}`)
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.loadHistoricalAndForecast();
        },
        error: (err) => {
          this.error = 'Failed to fetch weather data. Please try again.';
          this.loading = false;
          console.error(err);
        }
      });
  }

  loadHistoricalAndForecast() {
    // Try to fetch forecast data from /api/weather/{city}/forecast endpoint
    this.http.get<ForecastResponse>(`${environment.apiBaseUrl}/api/weather/${this.city}/forecast`)
      .subscribe({
        next: (data) => {
          console.log('Forecast data received:', data);
          this.forecastData = data.list || [];
          if (this.forecastData.length > 0) {
            console.log(`Using real forecast data: ${this.forecastData.length} items`);
          }
          this.buildTimeline();
        },
        error: (err) => {
          // If forecast endpoint doesn't exist, create mock forecast from current data
          console.warn('Forecast endpoint not available, creating timeline from current data', err);
          this.forecastData = [];
          this.createMockTimeline();
        }
      });
  }

  buildTimeline() {
    const timeline: HistoricalWeather[] = [];
    const now = new Date();

    // Add past weather (last 24 hours - simulated)
    for (let i = 6; i > 0; i--) {
      const pastDate = new Date(now);
      pastDate.setHours(now.getHours() - i * 4);
      timeline.push({
        time: this.formatTime(pastDate),
        date: this.formatDate(pastDate),
        temperature: this.weatherData ? Math.round(this.weatherData.main.temp - (i * 2) + Math.random() * 4) : 0,
        description: this.weatherData?.weather[0].description || 'N/A',
        icon: this.weatherData?.weather[0].icon || '',
        humidity: this.weatherData ? Math.round(this.weatherData.main.humidity + (Math.random() * 10 - 5)) : 0,
        type: 'past'
      });
    }

    // Add current weather
    if (this.weatherData) {
      timeline.push({
        time: 'Now',
        date: this.formatDate(now),
        temperature: Math.round(this.weatherData.main.temp),
        description: this.weatherData.weather[0].description,
        icon: this.weatherData.weather[0].icon,
        humidity: this.weatherData.main.humidity,
        type: 'current'
      });
    }

    // Add future forecast (next 5 days) - Use real forecast data if available
    if (this.forecastData.length > 0) {
      console.log('Building timeline with real forecast data');
      this.forecastData.slice(0, 8).forEach((forecast, index) => {
        // Parse date from dt_txt or use dt timestamp
        let forecastDate: Date;
        if (forecast.dt_txt) {
          forecastDate = new Date(forecast.dt_txt);
        } else if (forecast.dt) {
          forecastDate = new Date(forecast.dt * 1000); // Convert Unix timestamp to Date
        } else {
          forecastDate = new Date(now.getTime() + (index + 1) * 3 * 60 * 60 * 1000);
        }
        
        timeline.push({
          time: this.formatTime(forecastDate),
          date: this.formatDate(forecastDate),
          temperature: Math.round(forecast.main.temp),
          description: forecast.weather[0]?.description || 'N/A',
          icon: forecast.weather[0]?.icon || '',
          humidity: forecast.main.humidity || 0,
          type: 'future'
        });
      });
    } else {
      console.log('No forecast data available, using mock data');
      // Create mock future data if forecast not available
      for (let i = 1; i <= 8; i++) {
        const futureDate = new Date(now);
        futureDate.setHours(now.getHours() + i * 3);
        timeline.push({
          time: this.formatTime(futureDate),
          date: this.formatDate(futureDate),
          temperature: this.weatherData ? Math.round(this.weatherData.main.temp + (Math.random() * 6 - 3)) : 0,
          description: this.weatherData?.weather[0].description || 'N/A',
          icon: this.weatherData?.weather[0].icon || '',
          humidity: this.weatherData ? Math.round(this.weatherData.main.humidity + (Math.random() * 10 - 5)) : 0,
          type: 'future'
        });
      }
    }

    this.historicalWeather = timeline;
    this.loading = false;
  }

  createMockTimeline() {
    this.buildTimeline();
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  setActiveTab(tab: 'current' | 'timeline') {
    this.activeTab = tab;
  }

  roundTemp(temp: number): number {
    return Math.round(temp);
  }

  capitalize(text: string): string {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  getCurrentDate(): Date {
    return new Date();
  }

  getCurrentDateString(): string {
    const now = new Date();
    return `${this.formatDate(now)} - ${this.formatTime(now)}`;
  }

  roundTempSafe(temp: number | undefined): number {
    if (temp === undefined || temp === null) {
      return 0;
    }
    return Math.round(temp);
  }
}
