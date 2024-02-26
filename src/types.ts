export abstract class YacuModuleBaseClass {
  static readonly id: string;
  static readonly title: string;
  yacu: YacuScript;

  constructor(yacu: YacuScript) {
    this.yacu = yacu;
  }

  get id() {
    return YacuModuleBaseClass.id;
  }
  get title() {
    return YacuModuleBaseClass.title;
  }
}

export class ModuleRunner<TCollector, TProcessor> {
  constructor(
    private collector: DataCollector<TCollector>,
    private processor: DataProcessor<TCollector, TProcessor>,
    private injector: DOMInjector<TProcessor>,
  ) {}

  async run(): Promise<void> {
    const data = await this.collector.collectData();
    const processedData = this.processor.processData(data);
    this.injector.injectDataIntoDOM(processedData);
  }
}
