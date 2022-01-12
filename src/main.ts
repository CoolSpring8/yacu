import { AwardInfoStats } from "./modules/award-info-stats";
import { BlockUserTopic } from "./modules/block-user-topic";
import { UserPreference } from "./modules/user-preference";
import { MarkdownMath } from "./modules/markdown-math";
import { activateFetchInterceptor } from "./utils/fetch-interceptor";
import { activateURLChangeEmitter } from "./utils/event-source/history";

for (const c of [AwardInfoStats, BlockUserTopic, UserPreference, MarkdownMath])
  new c();

for (const f of [activateURLChangeEmitter, activateFetchInterceptor]) f();
