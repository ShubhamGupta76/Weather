import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

interface StateWeather {
  state: string;
  city: string;
  temperature: number;
  description: string;
  icon: string;
  loading: boolean;
  error: boolean;
}

@Component({
  selector: 'app-all-states',
  imports: [CommonModule],
  templateUrl: './all-states.html',
  styleUrl: './all-states.scss'
})
export class AllStates implements OnInit {
  states: StateWeather[] = [
    { state: 'Delhi', city: 'Delhi', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Maharashtra', city: 'Mumbai', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Karnataka', city: 'Bangalore', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Tamil Nadu', city: 'Chennai', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'West Bengal', city: 'Kolkata', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Gujarat', city: 'Ahmedabad', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Rajasthan', city: 'Jaipur', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Uttar Pradesh', city: 'Lucknow', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Punjab', city: 'Chandigarh', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Haryana', city: 'Gurgaon', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Telangana', city: 'Hyderabad', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Kerala', city: 'Kochi', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Odisha', city: 'Bhubaneswar', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Madhya Pradesh', city: 'Bhopal', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Bihar', city: 'Patna', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Assam', city: 'Guwahati', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Jharkhand', city: 'Ranchi', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Chhattisgarh', city: 'Raipur', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Uttarakhand', city: 'Dehradun', temperature: 0, description: '', icon: '', loading: true, error: false },
    { state: 'Himachal Pradesh', city: 'Shimla', temperature: 0, description: '', icon: '', loading: true, error: false }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchAllStatesWeather();
  }

  fetchAllStatesWeather() {
    this.states.forEach((stateData, index) => {
      this.http.get<WeatherResponse>(`${environment.apiBaseUrl}/api/weather/${stateData.city}`)
        .subscribe({
          next: (data) => {
            this.states[index].temperature = Math.round(data.main.temp);
            this.states[index].description = data.weather[0].description;
            this.states[index].icon = data.weather[0].icon;
            this.states[index].loading = false;
            this.states[index].error = false;
          },
          error: (err) => {
            this.states[index].loading = false;
            this.states[index].error = true;
            console.error(`Error fetching weather for ${stateData.city}:`, err);
          }
        });
    });
  }

  refreshWeather() {
    this.states.forEach(state => {
      state.loading = true;
      state.error = false;
    });
    this.fetchAllStatesWeather();
  }
}
