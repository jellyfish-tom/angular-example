import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { switchMap, filter, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { ApiPaths } from "@app/api-paths";

@Injectable()
export class DrugsService {
  private readonly autoRetryGetDrugs$: Observable<string>;
  private readonly refetchDrugsData$: BehaviorSubject<
    void
  > = new BehaviorSubject(null);
  private readonly maxRequestRetries = 5;
  private drugsFetchRetriesCount = 0;

  constructor(private http: HttpClient) {
    this.autoRetryGetDrugs$ = this.refetchDrugsData$.pipe(
      filter(
        (empty: any) => this.drugsFetchRetriesCount < this.maxRequestRetries
      ),
      switchMap((empty: any) => this.http.get<string>(ApiPaths.Drugs))
    );
  }

  public getDrugs() {
    return this.autoRetryGetDrugs$.pipe(
      tap((drugs: string) => {
        if (!drugs && this.drugsFetchRetriesCount < this.maxRequestRetries) {
          this.refetchDrugs();
        } else {
          this.resetRefetchDrugsConter();
        }
      })
    );
  }

  private refetchDrugs() {
    this.drugsFetchRetriesCount++;
    this.refetchDrugsData$.next();
  }

  private resetRefetchDrugsConter() {
    if (this.drugsFetchRetriesCount !== 0) {
      this.drugsFetchRetriesCount = 0;
    }
  }
}
