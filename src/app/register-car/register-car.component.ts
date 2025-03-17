import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-register-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register-car.component.html',
  styleUrls: ['./register-car.component.scss'],
})
export class RegisterCarComponent {
  registerForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private sharedService: SharedService, // Inject SharedService
    private router: Router,
    private fb: FormBuilder // Inject FormBuilder
  ) {
    this.registerForm = this.fb.group({
      registration_number: [
        '', 
        [
          Validators.required,
          Validators.pattern(/^(K[A-Z]{2} \d{3}[A-Z]|UN \d{3}[A-Z]{1,2}|CD \d{3}[A-Z]{1,2}|AMB \d{3})$/) 
          // Supports:
          // - Normal plates: KAA 123A
          // - UN plates: UN 123X
          // - Ambassador plates: AMB 123
          // - Diplomatic plates: CD 123X
        ]
      ],
      year_of_make: [
        '', 
        [
          Validators.required,
          Validators.min(2000),
          Validators.max(2025)
        ]
      ]
    });
  }

  /** Convert the number plate input to uppercase */
  convertToUppercase() {
    const control = this.registerForm.get('registration_number');
    if (control) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  registerCar() {
    if (this.registerForm.valid) {
      const vehicleData = this.registerForm.value;
  
      this.apiService.registerVehicle(vehicleData).subscribe((response) => {
        if (response && response.services) {
          // Store vehicle details in SharedService
          this.sharedService.setVehicleData(vehicleData);
  
          // Navigate to services page
          this.router.navigate(['/display-services'], { state: { services: response.services } });
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
  
}
