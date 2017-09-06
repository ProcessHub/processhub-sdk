// Internal objects used by ProcessHub client and server
import { Page } from "../path";
import { Tools } from "../";
import * as PH from "../";

export class InstanceState {
  currentInstance?: PH.Instance.InstanceDetails;

  // Instance Cache
  instance: {
    [instanceId: string]: PH.Instance.InstanceDetails
  };  
}

export const InstanceView = {
  // Enum wird für Url-Pfade genutzt, daher Elemente in Kleinschreibung
  Show: "show",
};
export type InstanceView = keyof typeof InstanceView;

// Extras, die für den angegebenen View benötigt werden
export function requiredInstanceViewExtras(page: Page, view: InstanceView): PH.Instance.InstanceExtras {
  switch (page) {
    case Page.InstancePage:
      switch (view) {
        case InstanceView.Show:
          return PH.Instance.InstanceExtras.None | PH.Instance.InstanceExtras.ExtrasFieldContents;
        default:
          if (Tools.isId(view.toUpperCase())) {
            // View scheint ein Todo zu sein
            return PH.Instance.InstanceExtras.None | PH.Instance.InstanceExtras.ExtrasFieldContents;
          } else
            return null;  // -> View ungültig
      }
    default:
      return null;
  }
}
