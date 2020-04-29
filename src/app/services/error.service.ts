import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ErrorService {
  private errorMessage = new Subject<string>();

  constructor() {}

  setErrorMessage(message: string) {
    this.errorMessage.next(message);
  }

  getErrorMessage(): Observable<string> {
    return this.errorMessage;
  }
}
