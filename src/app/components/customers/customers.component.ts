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

  //create a blank customer array in memory 
  newCustomer = {
    name: '',
    phone: 0,
    addresses: ['']
  }
  //create a blank customer array in memory 
  viewingCustomer = {
    key: '',
    name: '',
    phone: 0,
    addresses: ['']
  }
  //variable to store a single address temporarily
  newAddress = '';
  //variable to store the amount of records being retrieved from Firebase
  customerAmount = 0;

  //state variables to control what will be shown on the modal
  userIsAddingRecord = false; //the user is adding a new record
  userIsViewingRecord = false; //the user is viewing a record
  userIsDeletingRecord = false; //the user is deleting a record
  userIsAddingAddress = false; //the user is adding an additional address to a record

  //notification states
  updateNotification = false;
  newRecordNotification = false;
  deletedNotification = false;

  constructor(private _Service: CustomersService) { }

  //when this component is rendered, retrieve all records
  ngOnInit(): void {
    this.retrieve();
    //console.log(this.newCustomer);
  }
  
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
    //console.log(this.Customer);
  }

  //hide/show modal
  toggleModal() {
    if((document.getElementById('mainModal')as HTMLElement).className == "modal fade") {
      //clear all previous values in memory, in case another customer had been added recently
      this.resetValues();
      //show me the modal
      (document.getElementById('mainModal')as HTMLElement).className = "modal fade show d-block";
      //in case the modal is already showing then...
    } else {
      //reset all modal states to false
      this.resetStates();
      //reset all data in the viewingCustomer object
      this.clearViewingCustomer();
      //hide the modal
      (document.getElementById('mainModal')as HTMLElement).className = "modal fade";
    }
  }

  //this function clears all values in the newCustomer array in memory
  resetValues() {
    this.newCustomer.name = '';
    this.newCustomer.phone = 0;
    this.newAddress = '';
    this.newCustomer.addresses = [''];
  }
  //let's show the modal to add a new customer
  customerForm() {
    this.userIsAddingRecord = true;
    this.toggleModal();
  }
  //let's show the modal rendering the details of a user
  viewCustomer(name:any, key:any, phone:any, addresses:Array<any>) {
    //console.log(name + phone + key + addresses);
    //assign the values of the selected item to the virtual 'viewingCustomer' object
    this.viewingCustomer.name = name;
    this.viewingCustomer.key = key;
    this.viewingCustomer.phone = phone;
    for (let i = 0; i < addresses.length; i++) {
      this.viewingCustomer.addresses[i] = addresses[i];
    }
    //open the modal
    this.toggleModal();
    //the user is now viewing a record
    this.userIsViewingRecord = true;
  }
  //reset all modal states to false;
  resetStates() {
    this.userIsAddingRecord = false; 
    this.userIsViewingRecord = false; 
    this.userIsDeletingRecord = false; 
    this.userIsAddingAddress = false; 
  }
  //clears all data in the viewingCustomer object
  clearViewingCustomer() {
    this.viewingCustomer.key = '';
    this.viewingCustomer.name = '';
    this.viewingCustomer.phone = 0;
    this.viewingCustomer.addresses = ['']
  }
  //save new customer
  save() {
    //if there's no address for this customer
    if(this.newCustomer.addresses[0] == '') {
      //delete the blank element I put there (only way to make this work :'D )
      this.newCustomer.addresses.shift();
      //append the new address to the address object
      this.newCustomer.addresses.push(this.newAddress);
      //push the record to Firebase
      this._Service.addNewCustomer(this.newCustomer);
      //close the modal
      this.toggleModal();
      //show a proper notification
      this.showSuccessSaved();
    } else { 
      //if I already added an address to the new customer in memory
      //push this address to the addresses array
      this.newCustomer.addresses.push(this.newAddress); 
      //push the record to firebase
      this._Service.addNewCustomer(this.newCustomer); 
      //close the modal
      this.toggleModal();
      //show a proper notification
      this.showSuccessSaved();
    }
  }

  //delete the customer record whose key is being passed to the function
  deleteRecord(key: any) {
    this._Service.delete(key);
    this.showDeletedNotification();
  }

  //let's add an additional address
  addAdditionalAddress() {
    //this helps us show the new address input field on the modal
    this.userIsAddingAddress = true;
  }
  //update the record on firebase
  saveRecordWithNewAddress() {
    //push the new address into the virtual 'viewingCustomer' object
    this.viewingCustomer.addresses.push(this.newAddress);
    //update the record on Firebase
    this._Service.updateRecord(this.viewingCustomer.key, this.viewingCustomer);
    //close the modal once all is done
    this.toggleModal();
    //show a 'success' notification
    this.showSuccess();
  }
  //show a success notification once a record has been updated
  showSuccess() {
    this.updateNotification = true;
    setTimeout(() => {
      this.updateNotification = false;
    }, 3000
    );
  }
  //show a success notification once a new record has been saved
  showSuccessSaved() {
    this.newRecordNotification = true;
    setTimeout(() => {
      this.newRecordNotification = false;
    }, 3000
    );
  }
  //show a delete notification
  showDeletedNotification() {
    this.deletedNotification = true;
    setTimeout(() => {
      this.deletedNotification = false;
    }, 3000
    );
  }
}
