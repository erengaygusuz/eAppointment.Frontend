import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopBarService {
  constructor() {}

  subject = new Subject<void>();

  onTopbarClick() {
    this.subject.next();
  }
}
