import { get } from "idb-keyval";
import { API_BASE } from "../constant";
import { addAfterResponseHooks } from "../utils/fetch-interceptor";

/**
 * 1. 原计划在 state.data 数组上使用 Proxy，然而每次更新 data 都被重新赋值为一个新的数组，会覆盖 Proxy
 * 2. 目前的方案是拦截 fetch 响应，做过滤。存在一个问题是数组长度会减少，导致下次请求的 from 参数偏小，
 *    可能在累计过滤数 > size 的情况下无法继续往下浏览。用 {} 占原元素位置的方案也不可行，会在处理过程中出错。
 * 3. TODO：一个方案是在拦截器里设置 hidden: true，然后在页面上把 item.hidden 为 true 的元素设置上隐藏样式。
 */
export class BlockUserTopic {
  blockedUsers: Set<BlockedUser> | undefined;

  constructor() {
    const newTopics = new RegExp(`^${API_BASE}topic/new?`);
    const topicPosts = new RegExp(`^${API_BASE}Topic/\\d+/post?`);

    this.getBlockedUsers().then(() => {
      addAfterResponseHooks({
        url: newTopics,
        process: (topics) =>
          (topics as ITopic[]).filter(
            (topic) =>
              topic.userName === null || !this.blockedUsers?.has(topic.userName)
          ),
      });
      addAfterResponseHooks({
        url: topicPosts,
        process: (posts) =>
          (posts as IPost[]).filter(
            (post) =>
              post.userName === null || !this.blockedUsers?.has(post.userName)
          ),
      });
      // TODO: 别人的回复中引用被屏蔽用户的发帖内容
    });
  }

  async getBlockedUsers() {
    this.blockedUsers = await get<Set<BlockedUser>>("blocked-users");
  }
}

interface ITopic {
  userName: string | null;
}

interface IPost {
  userName: string | null;
  content: string;
}

// 用户名
export type BlockedUser = string;
