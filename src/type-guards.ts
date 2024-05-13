import is from "@sindresorhus/is";
import * as cheerio from 'cheerio';

export type PercentString = `${number}%`;

export function isPercentString(value: unknown): value is PercentString {
	if (is.string(value) && value.endsWith('%')) {
    return is.numericString(value.slice(0, -1));
  }
  return false;
}

export function isCheerioRoot(value: unknown): value is cheerio.Root {
  return (is.function(value) && 'root' in value && is.function(value.root));
}

export function isCheerio(value: unknown): value is cheerio.CheerioAPI {
  return (isCheerio(value) && 'version' in value && 'load' in value && is.function(value.load));
}
