import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('googleButton', { static: true }) googleButton!: ElementRef<HTMLButtonElement>;
  private googleInitialized = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Initialize Google Identity if available
    if (typeof window !== 'undefined' && (window as any).google && !this.googleInitialized) {
      try {
        google.accounts.id.initialize({
          client_id: environment.googleClientId,
          callback: (response: any) => this.handleCredentialResponse(response),
        });

        // Render a one-tap button into the placeholder div if desired or use custom button
        // Here we just enable the button which will trigger the prompt.
        this.googleInitialized = true;
      } catch (e) {
        // ignore initialization errors during development
        console.warn('Google Identity init failed', e);
      }
    }
  }

  ngOnDestroy(): void {
    // optionally cancel prompt
  }

  handleCredentialResponse(response: any) {
    // response.credential contains the ID token JWT
    console.log('Google credential response', response);
    // TODO: send token to backend or verify client-side as needed
    // For now, navigate to home on success
    this.router.navigate(['/']);
  }

  onLogin() {
    // TODO: Implement login logic, for now navigate to register if not registered
    this.router.navigate(['/register']);
  }

  onRegisterLink() {
    this.router.navigate(['/register']);
  }

  onGoogleSignInClick() {
    if ((window as any).google && this.googleInitialized) {
      // Trigger the Google One Tap prompt or request a credential
      google.accounts.id.prompt();
    } else {
      console.warn('Google Identity not ready');
    }
  }
}
