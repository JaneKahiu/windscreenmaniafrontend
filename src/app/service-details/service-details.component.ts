import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { SharedService } from '../services/shared.service';

interface VehicleMake {
  id: number;
  name: string;
}

interface VehicleModel {
  id: number;
  name: string;
  model: string;
}

interface vehicle {
  registration_number: '';
  year_of_make: '';
}

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './service-details.component.html',
})
export class ServiceDetailsComponent implements OnInit {
  selectedServices: number[] = [];
  selectedWindscreenType: string = '';
  selectedCustomization: string = '';
  selectedInsuranceProvider: string = '';
  userDetails = { fullName: '', kraPin: '', phone: '' };
  vehicleMakes: VehicleMake[] = [];
  vehicleModels: VehicleModel[] = [];
  windscreenTypes: any[] = [];
  vehicles: any[] = [];
  users: any[] = [];
  vehicleForm: FormGroup;

  selectedMake: number | null = null;
  selectedModel: number | null = null;
  isSubmitting = false;

  vehicleData = { registration_number: '', year_of_make: '' };

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService
  ) {
    this.vehicleForm = new FormGroup({
      make: new FormControl('', [Validators.required]),
      selectedModel: new FormControl('', [Validators.required]),
      vehicle: new FormControl('', [Validators.required]),
      user: new FormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.loadSavedData();
    this.fetchVehicleMakes();
    this.fetchWindscreenTypes();
    this.fetchVehiclesAndUsers();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  onSubmit() {
    console.log('submitting...');
    if (this.vehicleForm.valid) {
      console.log(this.vehicleForm.value);
      this.submitDetails();
    } else {
      this.vehicleForm.markAllAsTouched();
    }
  }

  fetchVehicleMakes(): void {
    this.apiService.getVehicleMakes().subscribe((makes) => {
      this.vehicleMakes = makes;
    });
  }

  fetchVehicleModels(makeId: number): void {
    this.apiService.getVehicleModels(makeId).subscribe((models) => {
      this.vehicleModels = models.map((model) => ({
        id: model.id,
        name: model.name,
        model: model.name,
      }));
    });
  }

  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe((types) => {
      this.windscreenTypes = types;
    });
  }

  onMakeChange(): void {
    if (this.vehicleForm.get('make')) {
      this.apiService
        .getVehicleModels(this.vehicleForm.get('make')?.value)
        .subscribe({
          next: (models: any[]) => {
            this.vehicleModels = models.map((model) => ({
              id: model.id,
              name: model.name,
              model: model.model ?? model.name,
            }));
          },
          error: (error: any) =>
            console.error('Error fetching vehicle models:', error),
        });
    } else {
      this.vehicleModels = [];
    }
  }

  fetchVehiclesAndUsers(): void {
    this.apiService.getRegisteredVehicles().subscribe({
      next: (vehicles) => (this.vehicles = vehicles),
      error: (error) => console.error('Error fetching vehicles:', error),
    });

    this.apiService.getUserDetails().subscribe({
      next: (users) => (this.users = users),
      error: (error) => console.error('Error fetching users:', error),
    });
  }

  private loadSavedData(): void {
    const savedData = this.sharedService.getServiceData();
    console.log('SD: ', savedData);
    if (savedData) {
      this.selectedServices = savedData.selectedServices || [];
      this.selectedWindscreenType = savedData.windscreenType || '';
      this.selectedCustomization = savedData.windscreenCustomizations || '';
      this.selectedInsuranceProvider = savedData.insuranceProvider || '';
      this.userDetails = { ...this.userDetails, ...savedData.userDetails };
      console.log('USER DETAILS:', savedData);
    }
  }

  submitDetails(): void {
    // if (
    //   !this.userDetails.fullName ||
    //   !this.userDetails.kraPin ||
    //   !this.userDetails.phone
    // ) {
    //   console.error('Please fill in all required user details');
    //   return;
    // }

    this.isSubmitting = true;

    const serviceData = {
      vehicle_id: this.vehicleForm.get('vehicle')?.value,
      selected_services: this.selectedServices,
      // windscreen_details: this.selectedWindscreenType
      //   ? {
      //       type_id: this.selectedWindscreenType,
      //       customization_id: this.selectedCustomization,
      //     }
      //   : null,
      // insurance_provider: this.selectedInsuranceProvider,
      // user_details: this.userDetails,
      // registration_number: this.vehicleData.registration_number, // Include vehicle details
      // year_of_make: this.vehicleData.year_of_make, // Include vehicle details
    };

    this.apiService.submitService(serviceData).subscribe({
      next: (response) => {
        console.log('Service submitted successfully:', response);
        this.sharedService.clearServiceData();
        this.sharedService.clearVehicleData(); // Clear vehicle details after submission
        this.isSubmitting = false;
        this.router.navigate(['/quote']);
      },
      error: (error) => {
        console.error('Error submitting service:', error);
        this.isSubmitting = false;
      },
    });
  }
}
