import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MyEventService {
  public startTaskEvent: BehaviorSubject<any> = new BehaviorSubject(undefined);

  constructor() {}
}
