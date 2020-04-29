import { Injectable, OnDestroy } from "@angular/core";
import { Observable, BehaviorSubject, Subject, of, combineLatest } from "rxjs";
import { switchMap, filter, takeUntil } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

import { Quarantine, PatientsRegister } from "hospital-lib";

import {
  formatDrugsFromString,
  formatPatientsRegisterFromString,
} from "@utils/index";
import { ApiService } from "@services/api.service";
import { AutofetchService } from "@services/autofetch.service";

export interface HistoricReport {
  preTreatmentPatients: PatientsRegister;
  postTreatmentPatients: PatientsRegister;
  drugs: string[];
}

export type QuarantineData = [string[], PatientsRegister];

@Injectable()
export class HospitalService implements OnDestroy {
  private readonly refetchQuarantineData$ = new Subject<void>();
  private drugs: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private patients: BehaviorSubject<PatientsRegister> = new BehaviorSubject(
    null
  );
  private history: HistoricReport[] = [];
  private quarantine: Quarantine;
  private maxHistoryElements = 10;
  private quarantineData$: Observable<QuarantineData>;
  private ngUnsubscribe = new Subject();

  constructor(
    private autofetchService: AutofetchService,
    private apiService: ApiService,
    private http: HttpClient
  ) {
    this.patients
      .pipe(filter((it: PatientsRegister) => !!it))
      .subscribe((patients: PatientsRegister) => {
        this.quarantine = new Quarantine(patients);
      });

    this.quarantineData$ = combineLatest([
      this.apiService.drugsService.getDrugs(),
      this.apiService.patientsService.getPatients(),
    ]).pipe(
      takeUntil(this.ngUnsubscribe),
      switchMap((combo: [string, string]) =>
        of([
          formatDrugsFromString(combo[0]),
          formatPatientsRegisterFromString(combo[1]),
        ])
      )
    ) as Observable<[string[], PatientsRegister]>;

    this.refetchQuarantineData$
      .pipe(
        takeUntil(this.ngUnsubscribe),
        switchMap((empty: any) => this.quarantineData$)
      )
      .subscribe((quarantineData: QuarantineData) => {
        this.setDrugs(quarantineData[0]);
        this.setPatients(quarantineData[1]);
      });

    this.autofetchService
      .getIntervalFetch(this.quarantineData$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((quarantineData: QuarantineData) => {
        this.setDrugs(quarantineData[0]);
        this.setPatients(quarantineData[1]);
        this.applyDrugs();
      });
  }

  get historicReports(): Observable<HistoricReport[]> {
    return of(this.history);
  }

  getData() {
    this.refetchQuarantineData$.next();
  }

  setPatients(patients: PatientsRegister | null) {
    this.patients.next(patients);
  }

  setDrugs(drugs: string[]) {
    this.drugs.next(drugs);
  }

  getPatients(): PatientsRegister | null {
    return this.patients.value;
  }

  getDrugs(): string[] {
    return this.drugs.value;
  }

  applyDrugs() {
    const drugs = this.getDrugs();
    const patients = this.getPatients();

    if (drugs.length > 0) {
      this.quarantine.setDrugs(drugs);
      this.quarantine.wait40Days();

      this.addHistoryItem(drugs, patients, this.quarantine.report());
    }

    this.setDrugs([]);
    this.setPatients(null);
  }

  private addHistoryItem(
    drugs: string[],
    preTreatmentPatients: PatientsRegister,
    postTreatmentPatients: PatientsRegister
  ) {
    const historyItem = {
      position: this.history.length + 1,
      drugs,
      preTreatmentPatients,
      postTreatmentPatients,
    };

    if (this.history.length < this.maxHistoryElements) {
      this.history.push(historyItem);
    } else {
      this.history.shift();
      this.history.push(historyItem);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
