import { proxy, subscribe } from "valtio";
import {
  YACU_CONSOLE_MESSAGE_PREFIX,
  YACU_PERSISTED_SETTINGS_KEY,
} from "../constants.js";
import { detectPageType } from "../utils/index.js";

export class YacuMainScript implements YacuScript {
  modules: YacuModule[] = [];
  settings = proxy({});

  addModule(module: YacuModule) {
    this.modules.push(module);
  }

  log(message: string) {
    console.log(`${YACU_CONSOLE_MESSAGE_PREFIX}${message}`);
  }

  async run() {
    // 读取设置
    try {
      const persistedSettings =
        typeof GM.getValue === "function"
          ? await GM.getValue(YACU_PERSISTED_SETTINGS_KEY)
          : localStorage.getItem(YACU_PERSISTED_SETTINGS_KEY);
      // TODO: 校验类型
      if (persistedSettings) {
        this.settings = JSON.parse(persistedSettings as string);
      }
    } catch (err) {
      this.log(`读取设置失败 ${err}`);
    }

    // 订阅设置更新，更新时自动持久化
    subscribe(this.settings, () => {
      // TODO: 校验类型
      if (typeof GM.setValue === "function") {
        GM.setValue(YACU_PERSISTED_SETTINGS_KEY, JSON.stringify(this.settings));
      } else {
        localStorage.setItem(
          YACU_PERSISTED_SETTINGS_KEY,
          JSON.stringify(this.settings),
        );
      }
    });

    // 启动各个模块
    await this.performTasks("run");

    // 定时检测页面类型，执行对应任务
    setInterval(() => {
      const pageType = detectPageType();

      this.performTasks("atAny");

      if (pageType === "topic") {
        this.performTasks("atTopic");
      }
    }, 100);
  }

  async performTasks(functionType: YacuBatchedFunctionType) {
    const results = await Promise.allSettled(
      this.modules.map((module) => module[functionType]?.()),
    );
    for (const result of results) {
      if (result.status === "rejected") {
        this.log(result.reason);
      }
    }
  }
}
