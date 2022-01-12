import { emitter } from "../event-emitter";

const changeStates = ["pushState", "replaceState"] as const;

export function activateURLChangeEmitter() {
  // 为了触发相应功能，脚本初始化时发出一次 url-change 事件
  emitter.emit("after-url-change", { to: window.location.pathname });

  for (const changeState of changeStates) {
    window.History.prototype[changeState] = new Proxy(
      window.History.prototype[changeState],
      {
        apply: (
          target,
          thisArgument,
          arguments_: [data: unknown, unused: string, url?: string | URL | null]
        ) => {
          const url = arguments_[2];

          const from = window.location.pathname;
          const to = url ? String(url) : undefined;

          emitter.emit("before-url-change", { from, to });

          Reflect.apply(target, thisArgument, arguments_);

          setTimeout(() => emitter.emit("after-url-change", { from, to }));
        },
      }
    );
  }
}
