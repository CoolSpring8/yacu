import { YacuMainScript } from "./base/index.js";
import Modules from "./modules/index.js";

async function main() {
  const script = new YacuMainScript();

  for (const module of Object.values(Modules)) {
    try {
      script.addModule(new module(script));
    } catch (err) {
      if (typeof module === "function" && module?.name) {
        script.log(`加载模块 ${module.id} 失败 ${err}`);
      } else {
        script.log(`加载未知模块失败 ${err}`);
      }
    }
  }

  await script.run();
}

main();
