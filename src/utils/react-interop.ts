import type React from "react";
import { BasicError } from "./error";

/**
 * 参考 https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 *
 *  为 CC98 当前 React 版本（React 16）优化，删减了部分代码
 */
export function getReact(element: Element) {
  const [, instance] =
    Object.entries(element).find(([name]) =>
      name.startsWith("__reactInternalInstance")
    ) ?? [];

  if (!instance) {
    throw new ReactInteropError(`未发现 React 实例`);
  }

  return _recurse(instance).stateNode;
}

// 原理没有搞懂
function _recurse(instance: IFiber) {
  let parent = instance.return;
  // 若 parent.type 是 HTML 标签名则继续重复
  while (typeof parent.type === "string") {
    parent = parent.return;
  }
  return parent;
}

export class ReactInteropError extends BasicError {
  constructor(message?: string) {
    super(message);
    this.name = "ReactInteropError";
  }
}

export interface IFiber {
  return: IFiber;
  stateNode: React.Component;
  // eslint-disable-next-line @typescript-eslint/ban-types
  type: Function | keyof HTMLElementTagNameMap;
}
