import { isDebug } from "../config";
import { BasicError } from "./error";

export const $ = (selector: string): Element | undefined => {
  const element = document.querySelector(selector);
  if (isDebug) {
    console.log(element);
  }

  return element ?? undefined;
};

export const $$ = (selector: string): Element[] => {
  const elements = document.querySelectorAll(selector);
  if (isDebug) {
    console.log(elements);
  }

  return [...elements];
};

export function createEmptyDiv({
  className,
  id,
}: {
  className?: string;
  id?: string;
} = {}) {
  const element = document.createElement("div");

  if (className) {
    element.className = className;
  }
  if (id) {
    element.id = id;
  }

  return element;
}

// 未经测试
export class DOMObserver {
  selectorCallbackMap: Map<string, (() => void)[]>;

  constructor() {
    this.selectorCallbackMap = new Map();
  }

  /**
   * 未测试，看起来时间复杂度爆炸
   */
  startMonitorDOMChange() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== "childList") {
          return;
        }
        for (const node of mutation.addedNodes) {
          for (const [
            selector,
            callbacks,
          ] of this.selectorCallbackMap.entries()) {
            const walker = document.createTreeWalker(
              node,
              NodeFilter.SHOW_ELEMENT,
              {
                acceptNode: (n) => {
                  if ((n as Element).matches(selector)) {
                    return NodeFilter.FILTER_ACCEPT;
                  }
                  return NodeFilter.FILTER_SKIP;
                },
              }
            );
            if (!walker.nextNode()) {
              return;
            }
            console.log(node);
            for (const callback of callbacks) {
              callback();
            }
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return observer;
  }

  addSelectorCallback(
    selector: string,
    callback: () => void
    /** TODO: shallow: boolean 不遍历子元素 */
  ) {
    const callbacks = this.selectorCallbackMap.get(selector) ?? [];
    callbacks?.push(callback);
    this.selectorCallbackMap.set(selector, callbacks);
  }
}

/**
 * 间隔一定时间重复查找页面元素，若发现则 resolve，若达到最大尝试次数仍未找到则 reject
 */
export function waitForElementsWithInterval(
  selector: string,
  interval = 500,
  maxRetry = 10
): Promise<Element[]> {
  return new Promise((resolve, reject) => {
    let count = 0;

    function retry() {
      if (isDebug) {
        console.log("retry", selector, count);
      }

      const elements = document.querySelectorAll(selector);
      if (elements.length > 0) {
        if (isDebug) {
          console.log(elements);
        }
        return resolve([...elements]);
      }

      count++;
      if (count >= maxRetry) {
        return reject(new DOMError(`${selector} max retry exceeded`));
      }

      setTimeout(() => retry(), interval);
    }

    retry();
  });
}

/**
 * 开始时使用 requestAnimationFrame，10 秒后换成间隔 5 秒的 setTimeout
 * TODO: 是否没必要或者不该用 rAF？
 * TODO: 是否能用 generator 表示？
 */
export function infinitelyOperateOnNewlyFoundElements(
  selector: string,
  callback: (elements: Element) => void
) {
  let canceled = false;
  let elapsed = 0;
  let start: DOMHighResTimeStamp;

  const processedElements: WeakSet<Element> = new WeakSet();

  function step(timestamp?: DOMHighResTimeStamp) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements.values()) {
      if (processedElements.has(element)) {
        continue;
      }

      // 新元素
      if (isDebug) {
        console.log(element);
      }
      callback(element);
      processedElements.add(element);
    }

    if (canceled) {
      return;
    }

    if (timestamp) {
      if (start === undefined) start = timestamp;
      elapsed = timestamp - start;
    }

    if (elapsed < 10 * 1000) {
      requestAnimationFrame(step);
    } else {
      setTimeout(step, 5 * 1000);
    }
  }

  requestAnimationFrame(step);

  return () => {
    canceled = true;
  };
}

export function addCSS(style: string) {
  const styleNode = document.createElement("style");
  styleNode.innerHTML = style;
  document.head.append(styleNode);
}

export class DOMError extends BasicError {
  constructor(message?: string) {
    super(message);
    this.name = "DOMError";
  }
}
