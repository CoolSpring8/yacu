import type { SvelteComponentDev } from "svelte/internal";
import { createEmptyDiv } from "./dom";

export function renderToNewElement(
  component: typeof SvelteComponentDev,
  properties?: Record<string, unknown>
) {
  const element = createEmptyDiv();
  new component({ target: element, props: properties });
  return element;
}
