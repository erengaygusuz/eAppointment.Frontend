import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SwalService {

  constructor() { }

  callToastr(title: string, icon: SweetAlertIcon = 'success'){
    Swal.fire({
      title: title,
      timer: 3000,
      icon: icon,
      position: 'bottom-right',
      showConfirmButton: false,
      showCancelButton: false,
      showCloseButton: false,
      toast: true
    })
  }

  callSwal(title: string, text: string, callback: () => void){
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showConfirmButton: true,
      confirmButtonText: 'Delete',
      showCancelButton: true,
      cancelButtonText: 'Cancel'
    }).then(res => {
      if(res.isConfirmed){
        callback();
      }
    })
  }
}

export type SweetAlertIcon = 'success' | 'error' | 'warning' | 'info' | 'question'

