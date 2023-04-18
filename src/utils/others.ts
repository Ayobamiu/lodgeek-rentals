import { Rent } from "../models";

export function rentSelected(selectedRents: Rent[], rent: Rent) {
  return selectedRents.findIndex((i) => i.id === rent.id) > -1;
}
