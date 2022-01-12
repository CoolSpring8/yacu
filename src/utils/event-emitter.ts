import mitt from "mitt";
import { isDebug } from "../config";

type Events = {
  "before-url-change": { from?: string; to?: string };
  "after-url-change": { from?: string; to?: string };
};

export const emitter = (() => {
  const emitter = mitt<Events>();

  if (isDebug) {
    emitter.on("*", (...arguments_) => console.log(arguments_));
  }

  return emitter;
})();
