import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  @ViewChild('googleButton', { static: true }) googleButton!: ElementRef<HTMLButtonElement>;
  private googleInitialized = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && (window as any).google && !this.googleInitialized) {
      try {
        google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID', // TODO: replace
          callback: (response: any) => this.handleCredentialResponse(response),
        });
        this.googleInitialized = true;
      } catch (e) {
        console.warn('Google Identity init failed', e);
      }
    }
  }

  ngOnDestroy(): void {}

  handleCredentialResponse(response: any) {
    console.log('Register Google response', response);
    // TODO: handle registration using the token
    this.router.navigate(['/']);
  }

  onGoogleRegisterClick() {
    if ((window as any).google && this.googleInitialized) {
      google.accounts.id.prompt();
    } else {
      console.warn('Google Identity not ready');
    }
  }
}
