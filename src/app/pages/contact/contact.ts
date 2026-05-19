import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './contact.html',
  styleUrl: './contact.scss'
})
export class Contact {
  form = {
    name: '',
    email: '',
    company: '',
    message: ''
  };

  sending = false;
  successMessage = '';
  errorMessage = '';

  constructor(private cdr: ChangeDetectorRef) {}

  async sendContact() {
    if (this.sending) return;

    this.sending = true;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.form)
      });

      if (response.ok) {
        this.successMessage = 'Consulta enviada correctamente. Nos pondremos en contacto a la brevedad.';
        this.form = {
          name: '',
          email: '',
          company: '',
          message: ''
        };
      } else {
        this.errorMessage = 'No se pudo enviar la consulta.';
      }

    } catch (error) {
      console.error(error);
      this.errorMessage = 'No se pudo conectar con la API.';
    }

    this.sending = false;
    this.cdr.detectChanges();
  }
}
