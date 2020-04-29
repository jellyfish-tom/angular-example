import _ from "lodash";

import { Drugs, Drug, PatientsRegister } from "hospital-lib";

export const formatDrugsFromString = (drugs: string): string[] =>
  drugs.length > 0 ? drugs.split(",") : [];

export const formatPatientsRegisterFromString = (
  patients: string
): PatientsRegister =>
  patients.split(",").reduce((prev, item) => {
    if (item in prev) {
      prev[item]++;
    } else {
      prev[item] = 1;
    }

    return prev;
  }, {});

export const getDrugsTooltip = (drugs: string[]) => {
  return _.map(drugs, (drug: string) => _.invert(Drugs)[drug]).join(", ");
};
