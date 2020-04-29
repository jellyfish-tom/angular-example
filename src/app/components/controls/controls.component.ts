import { Component } from "@angular/core";
import { MatDialog } from "@angular/material";

import { PatientsRegister } from "hospital-lib";

import { ManualInputDialog } from "@components/dialogs/manual-input-dialog/manual-input-dialog.component";
import { HospitalService } from "@services/hospital.service";
import { AutofetchService } from "@services/autofetch.service";

@Component({
  selector: "controls",
  templateUrl: "./controls.component.html",
  styleUrls: ["./controls.component.scss"],
})
export class ControlsComponent {
  constructor(
    public autofetchService: AutofetchService,
    public hospitalService: HospitalService,
    public dialog: MatDialog
  ) {}

  applyDrugsButtonDisabled() {
    const patients = this.hospitalService.getPatients();

    return this.hospitalService.getDrugs().length === 0 || !patients;
  }

  openManualInputDialog(): void {
    const dialogRef = this.dialog.open(ManualInputDialog);

    dialogRef
      .afterClosed()
      .subscribe(
        (result: {
          data: { patientsRegister: PatientsRegister; drugs: string[] };
        }) => {
          this.hospitalService.setDrugs(result.data.drugs);
          this.hospitalService.setPatients(result.data.patientsRegister);
        }
      );
  }
}
