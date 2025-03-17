import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface VehicleMake {
  id: number;
  name: string;
}

export interface VehicleModel {
  id: number;
  name: string;
}

export interface WindscreenType {
  id: number;
  name: string;
  cost: number;
}

export interface WindscreenCustomization {
  id: number;
  name: string;
  cost: number;
}

export interface InsuranceProvider {
  id: number;
  name: string;
}

export interface Quote {
  id: number;
  quote_number: string;
  status: string;
  services: string[];
  total_cost: number;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  createQuote(payload: { vehicle: any; services: any[] }): Observable<any> {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) {}

  // Register a vehicle
  registerVehicle(vehicleData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register-vehicle/`, vehicleData);
  }

  // Generate a quote
  generateQuote(
    vehicleId: string,
    selectedServices: number[]
  ): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-quote/`, {
      vehicle_id: vehicleId,
      selected_services: selectedServices,
    });
  }
  // Create an order from a quote
  createOrder(quoteId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/orders/create/`, {
      quote_id: quoteId,
    });
  }

  // Get all available services
  getServices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-services/`);
  }

  // Get vehicle makes
  getVehicleMakes(): Observable<VehicleMake[]> {
    return this.http.get<VehicleMake[]>(`${this.apiUrl}/vehicle-makes/`);
  }

  // Get models for a specific make
  getVehicleModels(makeId: number): Observable<VehicleModel[]> {
    return this.http.get<VehicleModel[]>(
      `${this.apiUrl}/vehicle-models/${makeId}/`
    );
  }

  // Get available windscreen types
  getWindscreenTypes(): Observable<WindscreenType[]> {
    return this.http.get<WindscreenType[]>(`${this.apiUrl}/windscreen-types/`);
  }

  // Get windscreen customizations for a specific type
  getWindscreenCustomizations(
    typeId: number
  ): Observable<WindscreenCustomization[]> {
    return this.http.get<WindscreenCustomization[]>(
      `${this.apiUrl}/windscreen-customizations/${typeId}/`
    );
  }

  // Get insurance providers
  getInsuranceProviders(): Observable<InsuranceProvider[]> {
    return this.http.get<InsuranceProvider[]>(
      `${this.apiUrl}/insurance-providers/`
    );
  }

  // Submit a new service request
  submitService(serviceData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/generate-quote/`, serviceData);
  }

  // Get all quotes
  getQuotes(): Observable<Quote[]> {
    return this.http.get<Quote[]>(`${this.apiUrl}/get-quotes/`);
  }

  // Get orders
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders`);
  }

  updateQuoteStatus(quoteId: number, status: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/quotes/${quoteId}/update-status/`,
      { status }
    );
  }

  submitWorkProgress(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/work-progress/submit/`, formData);
  }

  getOrderDetails(vehicleRegNo: string) {
    return this.http.get(`/api/orders/${vehicleRegNo}`); // Adjust endpoint accordingly
  }

  getUserDetails(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-user-details/`);
  }

  // Get registered vehicles
  getRegisteredVehicles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/get-vehicles/`);
  }

  getOrderByNumber(orderNumber: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/orders/${orderNumber}`);
  }

  // Store the selected order
  setSelectedOrder(order: any): void {
    this.setSelectedOrder = order;
  }

  // Retrieve the selected order
  getSelectedOrder(): any {
    return this.setSelectedOrder;
  }
}
