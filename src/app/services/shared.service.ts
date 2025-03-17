import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private serviceData: any = null;
  private vehicleData: any = null;
  private selectedServices: any[] = [];
  private selectedOrder: any = null;
  services: any[] = [];

  constructor(private apiService: ApiService) {}


  setServices(services: any[]) { this.services = services; }
  getServices() { return this.services; }

  setSelectedServices(services: any[]) { this.selectedServices = services; }
  getSelectedServices() { return this.selectedServices; }

  submitQuote(): Observable<any> {
    const payload = { vehicle: this.vehicleData, services: this.selectedServices };
    return this.apiService.createQuote(payload);
  }

  // Methods for service data
  setServiceData(data: any) {
    this.serviceData = data;
  }

  getServiceData() {
    return this.serviceData;
  }

  clearServiceData() {
    this.serviceData = null;
  }

  setVehicleData(data: { registration_number: string; year_of_make: string }) {
    this.vehicleData = data;
  }

  getVehicleData() {
    return this.vehicleData || { registration_number: '', year_of_make: '' };
  }
  

  clearVehicleData() {
    this.vehicleData = null;
  }
 
  
  
    setSelectedOrder(order: any) {
      this.selectedOrder = order;
    }
  
    getSelectedOrder() {
      return this.selectedOrder;
    }
  
    clearSelectedOrder() {
      this.selectedOrder = null;
    }
  
}
