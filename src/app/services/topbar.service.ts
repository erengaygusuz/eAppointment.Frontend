import { EventEmitter, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TopBarService {

  constructor() {}

  subject = new Subject<void>();

  onTopbarClick(){

    this.subject.next();
  }
}
