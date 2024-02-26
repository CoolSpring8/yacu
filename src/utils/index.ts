import type React from "react";

export function detectPageType(): YacuPageType {
  if (location.pathname.startsWith("/topic/")) {
    return "topic";
  }
  return "general";
}

/**
 * 获取绑定在元素上的React实例，或该元素的祖先中最近的包含React实例的元素的React实例
 *
 * 参考：https://stackoverflow.com/questions/29321742/react-getting-a-component-from-a-dom-element-for-debugging
 * 另参考：https://github.com/baruchvlz/resq
 */
export function getReact(element: Element): React.Component | undefined {
  const instance = Object.entries(element).find(([name]) =>
    name.startsWith("__reactInternalInstance"),
  )?.[1];

  if (!instance) {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function recurse(instance: any) {
    let parent = instance;
    while (typeof parent.type === "string") {
      parent = parent.return;
    }
    return parent;
  }

  return recurse(instance).stateNode;
}
