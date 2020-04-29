import { Component, Input } from "@angular/core";

@Component({
  selector: "drugs-list",
  templateUrl: "./drugs-list.component.html",
  styleUrls: ["./drugs-list.component.scss"],
})
export class DrugsListComponent {
  @Input() drugs: string[];

  constructor() {}
}
