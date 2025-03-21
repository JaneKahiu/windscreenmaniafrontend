import { Component, OnInit } from '@angular/core';
import { ApiService, Quote } from '../../api.service';
import { NgIf, NgFor } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [NgIf, NgFor],
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'] 
})
export class AdminDashboardComponent implements OnInit {
  quotes: Quote[] = [];
  orders: any[] = [];
  userDetails: any[] = [];
  vehicles: any[] = [];
  loadingQuotes = false;
  loadingOrders = false;
  loadingUsers = false;
  loadingVehicles = false;
  
  showMoreQuotes = false;
  showMoreOrders = false;
  
  selectedOrder: any = null;
  workInProgressForm: FormGroup;

  constructor(private apiService: ApiService, private fb: FormBuilder,private router: Router) {
    this.workInProgressForm = this.fb.group({
      vehicle: ['', Validators.required],
      user: ['', Validators.required],
      images: [null],
      pdf: [null]
    });
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  ngOnInit() {
    this.fetchQuotes();
    this.fetchOrders();
    this.fetchUserDetails();
    this.fetchVehicleDetails();
  }

  fetchQuotes() {
    this.loadingQuotes = true;
    this.apiService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes;
        this.loadingQuotes = false;
      },
      error: (error) => {
        console.error('Error fetching quotes:', error);
        this.loadingQuotes = false;
      }
    });
  }

  fetchOrders() {
    this.loadingOrders = true;
    this.apiService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loadingOrders = false;
      },
      error: (error) => {
        console.error('Error fetching orders:', error);
        this.loadingOrders = false;
      }
    });
  }

  fetchUserDetails() {
    this.loadingUsers = true;
    this.apiService.getUserDetails().subscribe({
      next: (data) => {
        this.userDetails = data;
        this.loadingUsers = false;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.loadingUsers = false;
      }
    });
  }

  fetchVehicleDetails() {
    this.loadingVehicles = true;
    this.apiService.getRegisteredVehicles().subscribe({
      next: (data) => {
        this.vehicles = data;
        this.loadingVehicles = false;
      },
      error: (error) => {
        console.error('Error fetching vehicle details:', error);
        this.loadingVehicles = false;
      }
    });
  }

  onCreateWorkProgress(order: any) {
    this.selectedOrder = order;
  }

  onImageUpload(event: any) {
    const files = event.target.files;
    if (files.length > 3) {
      alert('You can only upload up to 3 images.');
      return;
    }
    this.workInProgressForm.patchValue({ images: files });
  }

  onPdfUpload(event: any) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
      alert('Please upload a valid PDF file.');
      return;
    }
    this.workInProgressForm.patchValue({ pdf: file });
  }

  submitForm() {
    if (this.workInProgressForm.valid) {
      console.log('Submitting form:', this.workInProgressForm.value);
    }
  }

  getServiceNames(serviceIds: string[]): string {
    const serviceMap: { [key: string]: string } = {
      '51': 'Tyre Change & Repair',
      '52': 'Windscreen Replacement',
      '53': 'Tints',
      '54': 'Body Works',
      '55': 'Alignment & Balancing',
    };
  
    return serviceIds.map(id => serviceMap[id] || 'Unknown Service').join(', ');
  }

}
