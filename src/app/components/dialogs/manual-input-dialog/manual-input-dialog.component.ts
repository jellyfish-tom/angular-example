import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";
import { FormControl, Validators } from "@angular/forms";

import { Drugs, Diseases, PatientsRegister } from "hospital-lib";

import { formatPatientsRegisterFromString } from "@utils/index";

export type RegisterItem = {
  name: string;
  code: string;
  patients: number;
  formControl: any;
};
export type DrugsListItem = { name: string; code: string };

@Component({
  selector: "manual-input-dialog",
  templateUrl: "manual-input-dialog.component.html",
  styleUrls: ["./manual-input-dialog.component.scss"],
})
export class ManualInputDialog {
  drugs = new FormControl();
  drugsList: DrugsListItem[] = [];
  diseasesRegister: RegisterItem[] = [];

  constructor(public dialogRef: MatDialogRef<ManualInputDialog>) {
    Object.keys(Drugs).forEach((key) => {
      this.drugsList.push({ name: key, code: Drugs[key] });
    });

    Object.keys(Diseases).forEach((key) => {
      this.diseasesRegister.push({
        name: key,
        code: Diseases[key],
        patients: 0,
        formControl: new FormControl("", [
          Validators.max(999),
          Validators.min(0),
        ]),
      });
    });
  }

  getPatientsRegisterFromDialogData(): PatientsRegister {
    const registerItemToArrayOfDiseaseCodes = (registerItem: RegisterItem) =>
      [...Array(registerItem.patients)].fill(registerItem.code);

    return formatPatientsRegisterFromString(
      this.diseasesRegister
        .map((registerItem) => registerItemToArrayOfDiseaseCodes(registerItem))
        .filter((arr) => arr.length > 0)
        .join(",")
    );
  }

  getDrugsFromDialogData(): string[] {
    return this.drugs.value ? this.drugs.value.map((drug) => drug.code) : [];
  }

  closeDialog() {
    this.dialogRef.close({
      event: "close",
      data: {
        patientsRegister: this.getPatientsRegisterFromDialogData(),
        drugs: this.getDrugsFromDialogData(),
      },
    });
  }

  dialogValid() {
    return (
      this.drugs.value &&
      this.drugs.value.length > 0 &&
      this.diseasesRegister.some((registerItem) => registerItem.patients > 0) &&
      this.diseasesRegister.every(
        (registerItem) => registerItem.formControl.valid
      )
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
