import { Component, Input } from "@angular/core";

import { PatientsRegister } from "hospital-lib";

@Component({
  selector: "patients-list",
  templateUrl: "./patients-list.component.html",
  styleUrls: ["./patients-list.component.scss"],
})
export class PatientsListComponent {
  @Input() patients: PatientsRegister;

  constructor() {}

  get displayablePatients() {
    return this.patients
      ? Object.keys(this.patients).map((key) => [
          `${key}: ${this.patients[key]} `,
        ])
      : [];
  }
}
