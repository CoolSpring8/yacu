import { YacuModuleBaseClass } from "../../types.js";
import { getReact } from "../../utils/index.js";
import {
  AwardInfoClass,
  FailCountAttr,
  FinishedAttr,
  MaxFailCount,
  AwardStatUITag,
} from "./constants.js";
import "./ui.js";

interface IAwardInfoProperties {
  awardInfo: Array<{
    content: string;
  }>;
}

export class AwardStatModule extends YacuModuleBaseClass implements YacuModule {
  static readonly id = "AwardStat";
  static readonly title = "楼层风评统计";

  atTopic() {
    function isUpdateFinishedOrFailed(element: HTMLElement) {
      return (
        element.getAttribute(FinishedAttr) !== null ||
        (Number(element.getAttribute(FailCountAttr)) || 0) >= MaxFailCount
      );
    }

    function accumulateAwardInfo(r: React.Component) {
      const accumulator: Record<string, number> = {};

      for (const award of (r.props as IAwardInfoProperties).awardInfo) {
        if (accumulator[award.content]) {
          accumulator[award.content]++;
        } else {
          accumulator[award.content] = 1;
        }
      }

      return accumulator;
    }

    function prependStatUI(
      element: HTMLElement,
      accumulatedInfo: Record<string, number>,
    ) {
      const statUI = document.createElement(AwardStatUITag);
      statUI.stat = Object.entries(accumulatedInfo);
      element.prepend(statUI);
    }

    function markUpdateAsFinished(element: HTMLElement) {
      element.setAttribute(FinishedAttr, "true");
    }

    function incrementFailCount(element: HTMLElement) {
      const currentFailCount = Number(element.getAttribute(FailCountAttr)) || 0;
      element.setAttribute(FailCountAttr, String(currentFailCount + 1));
    }

    const enabled = this.yacu.settings.awardStat?.enabled;
    if (enabled === false) return;

    const awardInfoElements = document.getElementsByClassName(
      AwardInfoClass,
    ) as HTMLCollectionOf<HTMLElement>;

    for (const element of awardInfoElements) {
      try {
        if (isUpdateFinishedOrFailed(element)) continue;

        const reactInstance = getReact(element);
        if (reactInstance) {
          const accumulatedInfo = accumulateAwardInfo(reactInstance);
          prependStatUI(element, accumulatedInfo);
          markUpdateAsFinished(element);
        }
      } catch (err) {
        incrementFailCount(element);
      }
    }
  }
}
