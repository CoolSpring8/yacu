interface YacuScript {
  log(message: string): void;
  settings: YacuSettings;
}

/**
 * YACU模块定义
 */
interface YacuModule {
  /** 模块ID，需唯一 */
  readonly id: string;
  /** 模块中文名，用于展示 */
  readonly title: string;
  /** YACU主脚本对象 */
  yacu: YacuScript;

  /**
   * 启动时执行的函数
   * 执行顺序为模块导入顺序串行
   * 支持async函数
   */
  run?(): void | Promise<void>;
  /** 任意页都执行的函数 */
  atAny?(): void | Promise<void>;
  /** 主题页执行的函数 */
  atTopic?(): void | Promise<void>;
}

type YacuBatchedFunctionType = "run" | "atAny" | "atTopic";

type YacuPageType = "general" | "topic";

interface DataCollector<T> {
  collectData(): Promise<T>;
}

interface DataProcessor<TInput, TOutput> {
  processData(input: TInput): TOutput;
}

interface DOMInjector<T> {
  injectDataIntoDOM(data: T): void;
}
