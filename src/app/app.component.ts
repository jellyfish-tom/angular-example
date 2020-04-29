import { Component, OnDestroy } from "@angular/core";
import { MatDialog } from "@angular/material";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ErrorDialogComponent } from "@components/dialogs/error-dialog/error-dialog.component";

import { ErrorService } from "@services/error.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  private ngUnsubscribe = new Subject();

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  constructor(private errorService: ErrorService, private dialog: MatDialog) {
    this.errorService
      .getErrorMessage()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((message: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message,
          },
        });
      });
  }
}
