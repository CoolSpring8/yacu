/**
 * author: Sec-ant (https://github.com/Sec-ant)
 * original script: https://greasyfork.org/zh-CN/scripts/426133-cc98-markdown-math
 */
import {
  addAfterResponseHooks,
  addBeforeRequestHooks,
} from "../utils/fetch-interceptor";

const defaultOptions = {
  apiBase: ["https://math.vercel.app", "https://math.now.sh"],
  color: "black",
  //alternateColor: "red"
};
// get post
const getPostsRequestRegExp = /post\/\d+\/original$/;
// edit post
const putPostRequestRegExp = /post\/\d+$/;
// new post
const newPostRequestRegExp = /topic\/\d+\/post$/;
// new topic
const newTopicRequestRegExp = /board\/\d+\/topic$/;
// tex image
const texImageURLRegExp =
  /(?<=\n|^)( *(?:> *)*)<center>\s*!\[.*?]\((.+?)\)\s*<\/center>|!\[.*?]\((.+?)\)/g;
// tex inline
const texInlineRegExp = /\$(\S|(?:\S.*?\S))\$/g;
// blockquote-aware tex block
const blockquoteAwareTexBlockRegExp =
  /(?<=^|\n)( *(?:> *)*)\${2}((?:\n\1[^\n$]+)+)\n\1\${2}(?=\n|$)/g;

/* HELPER FUNCITONS */

function standardizeColor(string_) {
  const context = document.createElement("canvas").getContext("2d");
  context.fillStyle = string_;
  return context.fillStyle;
}

function image2tex(
  content,
  { apiBase = defaultOptions.apiBase } = defaultOptions
) {
  function imageReplace(match, indent, blockURLString, inlineURLString) {
    const url = new URL(blockURLString || inlineURLString);
    if (apiBase.includes(url.origin)) {
      const searchParameters = url.searchParams;
      // block
      if (searchParameters.has("from")) {
        return ["$$", searchParameters.get("from").trim(), "$$"]
          .join("\n")
          .replace(/(?<=^|\n)/g, indent);
      }
      // inline
      else if (searchParameters.has("inline")) {
        return `$${searchParameters.get("inline")}$`;
      }
      // other
      else {
        return match;
      }
    } else {
      return match;
    }
  }
  return content.replace(texImageURLRegExp, imageReplace);
}

function tex2image(
  content,
  {
    apiBase = defaultOptions.apiBase,
    color = defaultOptions.color,
    alternateColor = defaultOptions.alternateColor,
  } = defaultOptions
) {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  function isInsideCodeFence(quoteLayers, precedingLines) {
    for (let index = quoteLayers; index >= 0; --index) {
      let backtickDelimiterCount = 0;
      let tildeDelimiterCount = 0;
      for (const line of precedingLines.reverse()) {
        const matchResult = line.match(
          new RegExp(String.raw`^ *(?:> *){${index}}(\`\`\`|~~~)?`)
        );
        if (matchResult === null) {
          break;
        } else if (typeof matchResult[1] !== "undefined") {
          switch (matchResult[1]) {
            case "```":
              ++backtickDelimiterCount;
              break;
            case "~~~":
              ++tildeDelimiterCount;
              break;
            default:
              break;
          }
        }
      }
      if (backtickDelimiterCount % 2 === 1 || tildeDelimiterCount % 2 === 1) {
        return true;
      }
    }
    return false;
  }

  function inlineReplace(match, tex, offset, string) {
    const precedingString = string.slice(0, offset);
    const precedingLines = precedingString.split("\n");
    const currentLine = precedingLines.pop();
    const inlineCodeDelimiterCount = (
      precedingString.split("\n").pop().match(/`/g) || []
    ).length;
    if (inlineCodeDelimiterCount % 2 === 1) {
      return match;
    }
    const quote = currentLine.match(/^( *(?:> *)*)/)[0];
    const quoteLayers = (quote.match(/>/g) || []).length;
    if (isInsideCodeFence(quoteLayers, precedingLines)) {
      return match;
    }
    const url = new URL(apiBase[0]);
    const searchParameters = url.searchParams;
    searchParameters.set("inline", tex);
    if (typeof color !== "undefined") {
      searchParameters.set("color", standardizeColor(color));
    }
    if (typeof alternateColor !== "undefined") {
      searchParameters.set("alternateColor", alternateColor);
    }
    return `![](${url.href})`;
  }

  function blockReplace(match, quote, quotedTex, offset, string) {
    const precedingString = string.slice(0, offset);
    const quoteLayers = (quote.match(/>/g) || []).length;
    const precedingLines = precedingString.replace(/\n$/, "").split("\n");
    if (isInsideCodeFence(quoteLayers, precedingLines)) {
      return match;
    }
    const url = new URL(apiBase[0]);
    const searchParameters = url.searchParams;
    searchParameters.set("from", quotedTex.replaceAll(quote, "").trim());
    if (typeof color !== "undefined") {
      searchParameters.set("color", standardizeColor(color));
    }
    if (typeof alternateColor !== "undefined") {
      searchParameters.set("alternateColor", alternateColor);
    }
    return `${quote}<center>![](${url.href})</center>`;
  }

  return content
    .replace(blockquoteAwareTexBlockRegExp, blockReplace)
    .replace(texInlineRegExp, inlineReplace);
}

export class MarkdownMath {
  constructor() {
    addAfterResponseHooks({
      url: [getPostsRequestRegExp],
      process: (post) => {
        // content type: markdown
        if (post.contentType === 1) {
          post.content = image2tex(post.content);
        }
        return post;
      },
    });
    addBeforeRequestHooks({
      url: [putPostRequestRegExp, newPostRequestRegExp, newTopicRequestRegExp],
      process: (post) => {
        // content type: markdown
        if (post.contentType === 1) {
          post.content = tex2image(post.content);
        }
        return post;
      },
    });
  }
}
