import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Holiday {
  name: string;
  date: Date;
  type: 'national' | 'religious' | 'regional';
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss'
})
export class Calendar {
  currentDate = signal(new Date());
  selectedDate = signal<Date | null>(null);
  showCalendar = signal(false);
  
  // Indian Holidays for 2025
  holidays: Holiday[] = [
    { name: 'New Year', date: new Date(2025, 0, 1), type: 'national' },
    { name: 'Republic Day', date: new Date(2025, 0, 26), type: 'national' },
    { name: 'Holi', date: new Date(2025, 2, 14), type: 'religious' },
    { name: 'Eid ul-Fitr', date: new Date(2025, 2, 31), type: 'religious' },
    { name: 'Ram Navami', date: new Date(2025, 3, 6), type: 'religious' },
    { name: 'Mahavir Jayanti', date: new Date(2025, 3, 12), type: 'religious' },
    { name: 'Ambedkar Jayanti', date: new Date(2025, 3, 14), type: 'national' },
    { name: 'Good Friday', date: new Date(2025, 3, 18), type: 'religious' },
    { name: 'Labour Day', date: new Date(2025, 4, 1), type: 'national' },
    { name: 'Eid ul-Adha', date: new Date(2025, 5, 17), type: 'religious' },
    { name: 'Independence Day', date: new Date(2025, 7, 15), type: 'national' },
    { name: 'Raksha Bandhan', date: new Date(2025, 7, 9), type: 'religious' },
    { name: 'Janmashtami', date: new Date(2025, 7, 26), type: 'religious' },
    { name: 'Ganesh Chaturthi', date: new Date(2025, 8, 2), type: 'religious' },
    { name: 'Onam', date: new Date(2025, 8, 5), type: 'regional' },
    { name: 'Gandhi Jayanti', date: new Date(2025, 9, 2), type: 'national' },
    { name: 'Dussehra', date: new Date(2025, 9, 2), type: 'religious' },
    { name: 'Diwali', date: new Date(2025, 9, 20), type: 'religious' },
    { name: 'Bhai Dooj', date: new Date(2025, 9, 22), type: 'religious' },
    { name: 'Guru Nanak Jayanti', date: new Date(2025, 10, 15), type: 'religious' },
    { name: 'Christmas', date: new Date(2025, 11, 25), type: 'religious' }
  ];

  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  getDaysInMonth(): Date[] {
    const year = this.currentDate().getFullYear();
    const month = this.currentDate().getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days: Date[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(new Date(year, month, -startingDayOfWeek + i + 1));
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  }

  isHoliday(date: Date): Holiday | null {
    return this.holidays.find(h => 
      h.date.getDate() === date.getDate() &&
      h.date.getMonth() === date.getMonth() &&
      h.date.getFullYear() === date.getFullYear()
    ) || null;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isCurrentMonth(date: Date): boolean {
    return date.getMonth() === this.currentDate().getMonth();
  }

  previousMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() - 1);
    this.currentDate.set(date);
  }

  nextMonth(): void {
    const date = new Date(this.currentDate());
    date.setMonth(date.getMonth() + 1);
    this.currentDate.set(date);
  }

  selectDate(date: Date): void {
    if (this.isCurrentMonth(date)) {
      this.selectedDate.set(date);
    }
  }

  getHolidaysForMonth(): Holiday[] {
    const month = this.currentDate().getMonth();
    const year = this.currentDate().getFullYear();
    return this.holidays.filter(h => 
      h.date.getMonth() === month && h.date.getFullYear() === year
    );
  }

  closeCalendar(): void {
    this.showCalendar.set(false);
  }

  toggle(): void {
    this.showCalendar.set(!this.showCalendar());
  }
}
