import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  MatTableModule,
  MatInputModule,
  MatDialogModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatButtonModule,
} from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ApiInterceptor } from "@interceptors/api.interceptor";
import { AppRoutingModule } from "@app/app-routing.module";
import { AppComponent } from "@app/app.component";
import { ResultsHistoryComponent } from "@components/results-history/results-history.component";
import { ControlsComponent } from "@components/controls/controls.component";
import { DrugsListComponent } from "@components/drugs-list/drugs-list.component";
import { PatientsListComponent } from "@components/patients-list/patients-list.component";
import { ManualInputDialog } from "@components/dialogs/manual-input-dialog/manual-input-dialog.component";
import { ErrorDialogComponent } from "@components/dialogs/error-dialog/error-dialog.component";
import { HospitalService } from "@services/hospital.service";
import { ApiService } from "@services/api.service";
import { DrugsService } from "@services/drugs.service";
import { PatientsService } from "@services/patients.service";
import { AutofetchService } from "@services/autofetch.service";
import { ErrorService } from "@services/error.service";

@NgModule({
  declarations: [
    AppComponent,
    ResultsHistoryComponent,
    ControlsComponent,
    DrugsListComponent,
    PatientsListComponent,
    ManualInputDialog,
    ErrorDialogComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltipModule,
    MatInputModule,
    AppRoutingModule,
    MatSelectModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
    MatTableModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  entryComponents: [ManualInputDialog, ErrorDialogComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
    ApiService,
    DrugsService,
    ErrorService,
    PatientsService,
    AutofetchService,
    HospitalService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
