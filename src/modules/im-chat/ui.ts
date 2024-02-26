import { LitElement, css, html } from "lit";
import { customElement } from "lit/decorators.js";
import { IMChatUITag } from "./constants.js";

declare global {
  interface HTMLElementTagNameMap {
    [IMChatUITag]: IMChatUI;
  }
}

@customElement(IMChatUITag)
export class IMChatUI extends LitElement {
  static styles = css``;

  render() {
    return html``;
  }
}
