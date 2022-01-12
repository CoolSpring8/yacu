import { AwardInfoStatsUI } from "../ui-components";
import { infinitelyOperateOnNewlyFoundElements } from "../utils/dom";
import { emitter } from "../utils/event-emitter";
import { getReact } from "../utils/react-interop";
import { renderToNewElement } from "../utils/svelte";

export class AwardInfoStats {
  pending = false;

  constructor() {
    emitter.on("after-url-change", ({ to }) => {
      if (to?.startsWith("/topic/")) {
        this.activate();
      }
    });
  }

  async activate() {
    this.pending = true;
    const cancel = infinitelyOperateOnNewlyFoundElements(
      ".awardInfo",
      (element) => this._activate(element)
    );
    emitter.on("before-url-change", () => cancel());
  }

  _activate(element: Element) {
    const r = getReact(element);
    const accumulator: Record<string, number> = {};
    for (const award of (r.props as IAwardInfoProperties).awardInfo) {
      if (accumulator[award.content]) {
        accumulator[award.content]++;
      } else {
        accumulator[award.content] = 1;
      }
    }
    const stats = Object.entries(accumulator);

    const statsElement = renderToNewElement(AwardInfoStatsUI, { stats });
    element.prepend(statsElement);

    this.pending = false;
  }
}

interface IAwardInfoProperties {
  awardInfo: {
    content: string;
  }[];
}
