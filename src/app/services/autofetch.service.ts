import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject, interval, combineLatest } from "rxjs";
import { switchMap, filter } from "rxjs/operators";

@Injectable()
export class AutofetchService {
  private autoFetchMilisecondsInterval = 30000;
  private autoFetch$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private timeoutTrigger$ = interval(this.autoFetchMilisecondsInterval);

  constructor() {}

  getIntervalFetch(observableToInterval: Observable<any>) {
    return combineLatest(this.autoFetch$, this.timeoutTrigger$).pipe(
      filter((combo: [boolean, any]) => !!combo[0]),
      switchMap((nothing: any) => observableToInterval)
    );
  }

  toggleAutoFetch() {
    this.autoFetch$.next(!this.autoFetch$.value);
  }
}
