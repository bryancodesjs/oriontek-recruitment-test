import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireList } from '@angular/fire/compat/database';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  //name of the route on the Firebase console
  private path = '/customers'
  //model we'll be using with this service
  customerModel: AngularFireList<Customer>;

  constructor(private db: AngularFireDatabase) {
    this.customerModel = db.list(this.path);
  }

  //retrieve all customers from the database
  getAllCustomers(): AngularFireList<Customer> {
    return this.customerModel;
  }
  //add a new customer to the database
  addNewCustomer(customer: Customer) {
    console.log('Record has been saved');
    return this.customerModel.push(customer);
  }
  //update a specific record
  updateRecord(key: string, value: any): Promise<void> {
    return this.customerModel.update(key, value);
  }
  //delete a record
  delete(key: string): Promise<void> {
    return this.customerModel.remove(key)
  }
}
