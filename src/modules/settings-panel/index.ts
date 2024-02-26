import { html, render } from "lit";
import { YacuModuleBaseClass } from "../../types.js";
import {
  SettingsPanelUITag,
  SettingsULContainerAttribute,
} from "./constants.js";
import "./ui.js";
import type { SettingsPanelUI } from "./ui.js";

export class SettingsPanelModule
  extends YacuModuleBaseClass
  implements YacuModule
{
  static readonly id = "SettingsPanel";
  static readonly title = "设置面板";

  panelUI?: SettingsPanelUI;

  run() {
    this.panelUI = document.createElement(SettingsPanelUITag);
    document.body.appendChild(this.panelUI);

    GM.registerMenuCommand("设置面板", () => {
      this.panelUI!.isHidden = false;
    });
  }

  atAny() {
    const handleClick = () => {
      this.panelUI!.isHidden = false;
    };
    const topBarMenuSettings = html`<li @click="${handleClick}">
      摸鱼脚本设置
    </li>`;
    const ulContainer =
      document.querySelector(
        `.topBarUserCenter-mainPage > ul:not([${SettingsULContainerAttribute}="true"])`,
      ) ||
      document.querySelector(
        `.topBarUserCenter > ul:not([${SettingsULContainerAttribute}="true"])`,
      );
    if (ulContainer) {
      render(topBarMenuSettings, ulContainer as HTMLElement);
      ulContainer.setAttribute(SettingsULContainerAttribute, "true");
    }
  }
}
