import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  username = '';
  password = '';
  errorMessage = '';
  loading = false;

  onSubmit(): void {
    if (!this.username || !this.password) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.errorMessage = 'Credenciais inválidas';
        } else {
          this.errorMessage = 'Erro ao conectar com o servidor';
        }
      },
    });
  }
}
