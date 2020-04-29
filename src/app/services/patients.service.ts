import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { ApiPaths } from "@app/api-paths";

@Injectable()
export class PatientsService {
  constructor(private http: HttpClient) {}

  getPatients() {
    return this.http.get<string>(ApiPaths.Patients).pipe();
  }
}
