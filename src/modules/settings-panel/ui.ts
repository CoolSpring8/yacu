import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import {
  fluentButton,
  fluentCheckbox,
  fluentDialog,
  fluentTextField,
  provideFluentDesignSystem,
} from "@fluentui/web-components";
import { SettingsPanelUITag } from "./constants.js";

provideFluentDesignSystem().register(
  fluentButton(),
  fluentCheckbox(),
  fluentDialog(),
  fluentTextField(),
);

declare global {
  interface HTMLElementTagNameMap {
    [SettingsPanelUITag]: SettingsPanelUI;
  }
}

@customElement(SettingsPanelUITag)
export class SettingsPanelUI extends LitElement {
  @property({ type: Boolean })
  isHidden = true;

  static styles = css``;

  closeDialog(): void {
    this.isHidden = !this.isHidden;
  }

  render() {
    return html`
      <fluent-dialog ?hidden="${this.isHidden}" modal>
        <h2>CC98优化摸鱼体验</h2>
      </fluent-dialog>
    `;
  }
}
