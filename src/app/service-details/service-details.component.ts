import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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

interface vehicle{
   registration_number: '',
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
  users: any[] =[]

  selectedMake: number | null = null;
  selectedModel: number | null = null;
  isSubmitting = false;
  
  vehicleData = { registration_number: '', year_of_make: '' };

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadSavedData();
    this.fetchVehicleMakes();
    this.fetchWindscreenTypes();
    this.fetchVehiclesAndUsers();
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  fetchVehicleMakes(): void {
    this.apiService.getVehicleMakes().subscribe(makes => {
      this.vehicleMakes = makes;
    });
  }

  fetchVehicleModels(makeId: number): void {
    this.apiService.getVehicleModels(makeId).subscribe(models => {
      this.vehicleModels = models.map(model => ({
        id: model.id,
        name: model.name,
        model: model.name
      }));
    });
  }


  fetchWindscreenTypes(): void {
    this.apiService.getWindscreenTypes().subscribe(types => {
      this.windscreenTypes = types;
    });
  }

  onMakeChange(): void {
    if (this.selectedMake) {
      this.apiService.getVehicleModels(this.selectedMake).subscribe({
        next: (models: any[]) => {
          this.vehicleModels = models.map(model => ({
            id: model.id,
            name: model.name,
            model: model.model ?? model.name 
          }));
        },
        error: (error: any) => console.error('Error fetching vehicle models:', error)
      });
    } else {
      this.vehicleModels = [];
      this.selectedModel = null; // Corrected type assignment
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
    if (savedData) {
      this.selectedServices = savedData.selectedServices || [];
      this.vehicleData = this.sharedService.getVehicleData(); 
      this.selectedWindscreenType = savedData.windscreenType || '';
      this.selectedCustomization = savedData.windscreenCustomizations || '';
      this.selectedInsuranceProvider = savedData.insuranceProvider || '';
      this.userDetails = { ...this.userDetails, ...savedData.userDetails };
    }
  }


  submitDetails(): void {
    if (!this.userDetails.fullName || !this.userDetails.kraPin || !this.userDetails.phone) {
      console.error('Please fill in all required user details');
      return;
    }
  
    this.isSubmitting = true;
  
    const serviceData = {
      selected_services: this.selectedServices,
      windscreen_details: this.selectedWindscreenType
        ? {
            type_id: this.selectedWindscreenType,
            customization_id: this.selectedCustomization,
          }
        : null,
      insurance_provider: this.selectedInsuranceProvider,
      user_details: this.userDetails,
      registration_number: this.vehicleData.registration_number, // Ensure this is populated
      year_of_make: this.vehicleData.year_of_make, // Ensure this is populated
    };
  
    this.apiService.submitService(serviceData).subscribe({
      next: (response) => {
        console.log('Service submitted successfully:', response);
        this.sharedService.clearServiceData();
        this.sharedService.clearVehicleData();
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
