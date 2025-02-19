import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-register-car',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, HeaderComponent],
  templateUrl: './register-car.component.html',
  styleUrls: ['./register-car.component.scss'],
})
export class RegisterCarComponent {
  vehicleData = {
    registration_number: '',
    year_of_make: '',
  };

  constructor(private apiService: ApiService, private router: Router) {}

  registerCar() {
    this.apiService.registerVehicle(this.vehicleData).subscribe((response) => {
      if (response && response.services) {
        this.router.navigate(['/display-services'], { state: { services: response.services } });
      }
    });
  }
}
