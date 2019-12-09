import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Point } from './models/point.service';

@Injectable({
  providedIn: 'root'
})
export class TrailService {
  remainingTrail$: BehaviorSubject<Point[]> = new BehaviorSubject<Point[]>([]);
  traveledTrail$: BehaviorSubject<Point[]> = new BehaviorSubject<Point[]>([]);
  constructor() { }

  navigateNext(){
    combineLatest([this.remainingTrail$,this.traveledTrail$]).subscribe( (latest) => {
      let nextPoint = latest[0].pop();
      latest[1].push(nextPoint);

      this.remainingTrail$.next(latest[0])
      this.traveledTrail$.next(latest[1]);
    }).unsubscribe();
  }

  init(){
    
  }
}
