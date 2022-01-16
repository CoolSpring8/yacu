import { isDebug } from "../config";

export type BeforeRequest = (
  request: Request,
  options: RequestInit
) => Request | Response | void | Promise<Request | Response | void>;

export type AfterResponse = (
  request: Request,
  responseClone: Response
) => Response | void | Promise<Response | void>;

/**
 * 仿照了 https://github.com/sindresorhus/ky 的 hooks 设计思路和处理方式
 */
export function patchFetch(hooks: {
  beforeRequest: BeforeRequest[];
  afterResponse: AfterResponse[];
}) {
  // TODO: 容错：无法识别的 fetch 调用方式应 pass through，并打印供调试
  window.fetch = new Proxy(window.fetch, {
    async apply(target, thisArgument, arguments_) {
      // Request
      const [input, init] = arguments_;

      let request = new Request(input, init);

      for (const preProcess of hooks.beforeRequest) {
        const temporary = await preProcess(request, init);

        // beforeRequest 直接返回响应
        if (temporary instanceof Response) {
          return temporary;
        }

        // beforeRequest 替换原请求，不再执行后续 hooks
        if (temporary instanceof Request) {
          request = temporary;
          break;
        }
      }

      // Response
      let response: Response = await Reflect.apply(target, thisArgument, [
        request,
      ]);

      for (const postProcess of hooks.afterResponse) {
        const temporary = await postProcess(request, response.clone());

        // afterResponse 替换
        if (temporary instanceof Response) {
          response = temporary;
        }
      }

      return response;
    },
  });
}

export const beforeRequestHooks: BeforeRequest[] = [];

export const afterResponseHooks: AfterResponse[] = [];

export function activateFetchInterceptor() {
  patchFetch({
    beforeRequest: beforeRequestHooks,
    afterResponse: afterResponseHooks,
  });
}

export function addBeforeRequestHooks(hook: {
  url: RegExp[];
  process: (content: unknown) => unknown;
}) {
  beforeRequestHooks.push(async (request, options) => {
    if (!hook.url.some((regex) => regex.test(request.url))) {
      return;
    }

    let oldData;
    if (options.body) {
      oldData = JSON.parse(options.body as string); // caution: 此处默认请求体是 JSON 格式
    }

    const newData = hook.process(oldData);

    return new Request(request, { body: JSON.stringify(newData) });
  });
}

export function addAfterResponseHooks(hook: {
  url: RegExp[];
  process: (content: unknown) => unknown;
}) {
  afterResponseHooks.push(async (request, response) => {
    if (!hook.url.some((regex) => regex.test(request.url))) {
      return;
    }

    const oldData = await response.json();

    const newData = hook.process(oldData);

    if (isDebug && Array.isArray(oldData) && Array.isArray(newData)) {
      const count = oldData.length - newData.length;

      if (count === 0) {
        console.log("没有内容需要过滤");
      } else {
        console.log(`过滤了${count}条内容`);
      }
    }

    return new Response(JSON.stringify(newData), response);
  });
}
