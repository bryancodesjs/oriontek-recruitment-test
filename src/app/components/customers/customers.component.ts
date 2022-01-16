import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

//import both customer service and model
import { CustomersService } from 'src/app/services/customers.service';
import { Customer } from 'src/app/models/customer.model';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  title = 'customers'
  //call and initialize the customer model
  Customer?: Customer[];

  newCustomer = {
    name: '',
    phone: 0,
    addresses: ['']
  }
  customerAmount = 0;
  //create a blank customer in memory using this variables
  newName = '';
  newPhone = 0;
  newAddress = '';
  newAddresses:any = {};

  constructor(private _Service: CustomersService) { }

  //when this component is rendered, retrieve all records
  ngOnInit(): void {
    this.retrieve();
    console.log(this.newCustomer);
  }
  //dummy customers list
  customers = [
    {
      name: 'bryan',
      phone: '8092201111',
      addresses: [
        "Madion St, 14",
        "Dan St, 14",
        "Calle arturo cirujano #45, piantini",
      ]
    },
    {
      name: 'Emely',
      phone: '8092201111',
      addresses: [
        "Madion St, 14",
        "Dan St, 14"
      ]
    },
    {
      name: 'Francis',
      phone: '8092201111',
      addresses: [
        "Calle Gaspar Polanco #46, Bella Vista",
        "Dan St, 14"
      ]
    },
  ]
  
  //retrieve all records from Firebase
  retrieve():void {
    this._Service.getAllCustomers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.Customer = data.reverse(); 
      this.customerAmount = data.length;
    });
    console.log(this.Customer);
  }

  //hide/show modal
  toggleModal() {
    if((document.getElementById('mainModal')as HTMLElement).className == "modal fade") {
      //clear all previous values in memory, in case another customer had been added recently
      this.resetValues();
      (document.getElementById('mainModal')as HTMLElement).className = "modal fade show d-block";
    } else {
      (document.getElementById('mainModal')as HTMLElement).className = "modal fade";
    }
  }
  //this function clears all values in the newCustomer object in memory
  resetValues() {
    this.newCustomer.name = '';
    this.newCustomer.phone = 0;
    this.newAddress = '';
    this.newCustomer.addresses = [''];
  }
  //save new customer
  save() {
    //if there's no address for this customer
    if(this.newCustomer.addresses[0] == '') {
      //delete the blank element I put there (only way to make this work :'D )
      this.newCustomer.addresses.shift();
      //append the new address to the address object
      this.newCustomer.addresses.push(this.newAddress);
      //give me some feedback on the console
      console.log(this.newCustomer);
      //push the record to Firebase
      this._Service.addNewCustomer(this.newCustomer);
    } else { 
      //if I already added an address to the new customer in memory
      //push this address to the addresses array
      this.newCustomer.addresses.push(this.newAddress); 
      //give me feedback
      console.log(this.newCustomer); 
      //push the record to firebase
      this._Service.addNewCustomer(this.newCustomer); 
    }
  }

}
