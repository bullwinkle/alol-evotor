import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ConfirmRegisterModalComponent {
  value: any
  constructor (
    public dialogRef: MdDialogRef<ConfirmRegisterModalComponent>
  ) {}
}

