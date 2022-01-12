import { UserPreferenceUI } from "../ui-components";
import { renderToNewElement } from "../utils/svelte";

export class UserPreference {
  constructor() {
    const element = renderToNewElement(UserPreferenceUI);
    document.body.append(element);
  }
}
