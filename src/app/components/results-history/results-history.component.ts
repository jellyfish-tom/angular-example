import { Component } from "@angular/core";

import { getDrugsTooltip as drugsTooltip } from "@utils/index";
import { HospitalService } from "@services/hospital.service";

@Component({
  selector: "results-history",
  templateUrl: "./results-history.component.html",
  styleUrls: ["./results-history.component.scss"],
})
export class ResultsHistoryComponent {
  private dataColumns = [
    "Healthy",
    "Diabetic",
    "Fever",
    "Tuberculosis",
    "Dead",
  ];

  constructor(public hospitalService: HospitalService) {}

  getPrefixedPatientsColumns(prefix: string) {
    return this.dataColumns.map((dc) => `${prefix}${dc}`);
  }

  getDrugsTooltip(drugs: string[]) {
    return drugsTooltip(drugs);
  }

  get displayedColumns() {
    return [
      ...this.getPrefixedPatientsColumns("pre"),
      "drugs",
      ...this.getPrefixedPatientsColumns("post"),
    ];
  }
}
