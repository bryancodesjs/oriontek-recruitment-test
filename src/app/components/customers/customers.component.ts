import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  title = 'customers'
  constructor() { }

  ngOnInit(): void {
  }
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
  
}
