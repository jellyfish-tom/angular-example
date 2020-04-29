import { Injectable } from "@angular/core";

import { PatientsService } from "@services/patients.service";
import { DrugsService } from "@services/drugs.service";

@Injectable()
export class ApiService {
  constructor(
    public drugsService: DrugsService,
    public patientsService: PatientsService
  ) {}
}
