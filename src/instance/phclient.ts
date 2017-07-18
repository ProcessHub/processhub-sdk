// Internal objects used by ProcessHub client and server
import { Page } from "../path";
import { Tools } from "../";
import * as PH from "../";

export class InstanceState {
  currentInstance?: PH.Instance.InstanceDetails;
  // instances: InstanceDetails[];
}

export const InstanceView = {
  // Enum wird für Url-Pfade genutzt, daher Elemente in Kleinschreibung
  Show: "show",
};
export type InstanceView = keyof typeof InstanceView;

export enum InstanceExtras {
  None = 0,
  ExtrasState = 1 << 0,
  ExtrasRoleOwners = 1 << 1,
  ExtrasRoleOwnersWithNames = 1 << 2, // ermittelt zusätzlich die Namen der Rolleninhaber
  ExtrasFieldContents = 1 << 3
}

// Extras, die für den angegebenen View benötigt werden
export function requiredInstanceViewExtras(page: Page, view: InstanceView): InstanceExtras {
  switch (page) {
    case Page.InstancePage:
      switch (view) {
        case InstanceView.Show:
          return InstanceExtras.None | InstanceExtras.ExtrasFieldContents;
        default:
          if (Tools.isId(view.toUpperCase())) {
            // View scheint ein Todo zu sein
            return InstanceExtras.None | InstanceExtras.ExtrasFieldContents;
          } else
            return null;  // -> View ungültig
      }
    default:
      return null;
  }
}
