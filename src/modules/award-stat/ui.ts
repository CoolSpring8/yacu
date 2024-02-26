import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AwardStatUITag } from "./constants.js";

declare global {
  interface HTMLElementTagNameMap {
    [AwardStatUITag]: AwardStatUI;
  }
}

@customElement(AwardStatUITag)
export class AwardStatUI extends LitElement {
  @property({ type: Array })
  stat: Array<[string, number]> = [];

  static styles = css`
    .award-info-stat {
      display: flex;
      font-size: 12px;
    }

    .item {
      color: #808080;
      margin-right: 4px;
    }

    .count {
      font-style: italic;
    }
  `;

  render() {
    return html`<div class="award-info-stat">
      <p>统计：</p>
      ${this.stat.map(
        (item, index, arr) =>
          html`<p class="item">
            ${item[0]} <span class="count">×${item[1]}</span>${index <
            arr.length - 1
              ? "；"
              : null}
          </p>`,
      )}
    </div>`;
  }
}
