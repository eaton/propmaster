import is, { Predicate, Primitive, TypeName, isString, isEmptyStringOrWhitespace } from '@sindresorhus/is';
import { ObjectProxy, PropertyProxy, SortablePrimitive } from './types.js';
import { getValue } from './functions/get-value.js';
import * as dot from './functions/dot.js';
import { isEmpty } from './functions/is-empty.js';
import micromatch from 'micromatch';
import { toCase } from '@eatonfyi/text';
import prettyMilliseconds from 'pretty-ms';
import prettyBytes from 'pretty-bytes';

type PercentString = `${number}%`;

function isPercentString(value: unknown): value is PercentString {
	if (isString(value) && value.endsWith('%')) {
    return is.numericString(value.slice(0, -1));
  }
  return false;
}

export class Property implements PropertyProxy {
  constructor(object: ObjectProxy, path: string) {
    this.path = path;
    this.object = object;
    this.value = getValue(object, path);
  }

  readonly object: ObjectProxy;
  readonly path: string;
  protected _value: unknown;

  get value(): unknown {
    return this._value;
  }

  set value(input: unknown) {
    this._value = input;
    if (!this.object.options.batchMutations) this.object.set(this.path, { value: this._value });
  }

  done() {
    if (this.object.options.batchMutations) this.object.set(this.path, { value: this._value });
    return this.object;
  }

  /**
   * Finalizes any mutations made to the current value, pushing them to the
   * parent object the property belongs to.
   * 
   * @remarks
   * 
   * This is somewhat janky; if an object or array reference is being used, this
   * is unecessary. For primitives, however, we receive an automatic copy of the
   * value and must push it back to the parent object.
   * 
   * We might want to solve this by always doing the full path lookup, but that
   * may have ugly perfomance implications. Need to test it later. 
   * 
   * @experimental
   */
  set(input?: unknown) {
    if (!is.undefined(input)) {
      this.value = input;
    }
    this.object.set(this.path, { value: this.value });
    return this;
  }

  /**
   * A string representation of the property's value type.
   * 
   * @remarks
   * 
   * This type name is more specific than the one returned by JavaScript's `typeof`;
   * @see {@link TypeName} for a complete list of supported types.
   */
  get type() {
    return is(this.value).toString();
  }

  /** Type checking, equality, and comparisons **/

  /**
   * Returns `true` if the current value's type name matches the input string.
   * 
   * @remarks
   * 
   * This type name is more specific than the one returned by JavaScript's `typeof`;
   * @see {@link TypeName} for a complete list of supported types.
   */
  is(input: TypeName | Lowercase<TypeName>) {
    return this.type.toLocaleLowerCase() === input.toLocaleLowerCase();
  }

  /**
   * Returns `true` if the current value's type name DOES NOT match the input string.
   */
  isNot(input: TypeName | Lowercase<TypeName>) {
    return !this.is(input);
  }

  /**
   * Returns `true` if the current value is empty.
   * 
   * @remarks
   * 
   * By default this checks for undefined, null, and zero-length string values.
   * @see {isEmpty} for options to configure the empty-check rules.
   */
  isEmpty() {
    return isEmpty(this.value, this.object.options);
  }

  /**
   * Returns `true` if the current value is *not* empty.
   */
  notEmpty() {
    return !this.isEmpty();
  }

  /**
   * Returns `true` if the current value is equivalent to the input value.
   * 
   * @remarks
   * 
   * This  function uses a deep equality check to handle arrays, nested object properties,
   * and other complex data types but is not guranteed to work on class instances.
   */
  isEqualTo(input: unknown): boolean {
    return dot.equals(input, this.value)
  }

  /**
   * Returns `true` if the current value is *not equivalent* to the input value.
   * 
   * @remarks
   * 
   * This  function uses a deep equality check to handle arrays, nested object properties,
   * and other complex data types but is not guranteed to work on class instances.
   */
  notEqualTo(input: unknown) {
    return !this.eq(input);
  }

  /**
   * Returns `true` if the current value is greater than the input value.
   * 
   * Note that this check only works with strings, numbers, and dates.
   */
  isGreaterThan(input: SortablePrimitive) {
    if ((is.number(input) && is.number(this.value))) return (this.value > input);
    if (is.string(input) && is.string(this.value)) return (this.value > input);
    if (is.date(input) && is.date(this.value)) return (this.value > input);
    return false;
  }

  /**
   * Returns `true` if the current value is less than the input value.
   * 
   * Note that this check only works with strings, numbers, and dates.
   */
  isLessThan(input: SortablePrimitive) {
    if ((is.number(input) && is.number(this.value))) return (this.value < input);
    if (is.string(input) && is.string(this.value)) return (this.value < input);
    if (is.date(input) && is.date(this.value)) return (this.value < input);
    return false;
  }

  /**
   * Returns `true` if the current value is between the `min` and `max` input
   * values.
   * 
   * Note that this check only works with strings, numbers, and dates.
   */
  isBetween(min: SortablePrimitive, max: SortablePrimitive) {
    if ((is.number(min) && is.number(max) && is.number(this.value))) {
      return this.value >= min && this.value <= max;
    }

    if ((is.string(min) && is.string(max) && is.string(this.value))) {
      return this.value >= min && this.value <= max;
    }

    if ((is.date(min) && is.date(max) && is.date(this.value))) {
      return this.value >= min && this.value <= max;
    }
    return false;
  }

  /**
   * Returns `true` if the current value is *not between* the `min` and `max` input
   * values.
   * 
   * Note that this check only works with strings, numbers, and dates.
   */
  notBetween(min: SortablePrimitive, max: SortablePrimitive)  {
    return !this.isBetween(min, max);
  }

  /**
   * Returns `true` if the current value is contained in the input array.
   * 
   * Note that this check only works with primitive values; in the future, it 
   * may be expanded to use a deep equality check on each item, but that would
   * be slightly ridiculous.
   */
  isIn(input: Primitive[]) {
    if (!is.primitive(this.value)) return false;
    return input.includes(this.value);
  }

  /**
   * Returns `true` if the current value is *not contained* in the input array.
   * 
   * Note that this check only works with primitive values; in the future, it 
   * may be expanded to use a deep equality check on each item, but that would
   * be slightly ridiculous.
   */
  notIn(input: Primitive[]) {
    return !this.isIn(input);
  }

  /**
   * Returns `true` if the current value is an array that contains the input value.
   * 
   * Note that this check only works with primitive values; in the future, it 
   * may be expanded to use a deep equality check on each item, but that would
   * be slightly ridiculous.
   */
  contains(input: unknown) {
    if (!is.array(this.value)) return false;
    return this.value.includes(input);
  }

  /**
   * Returns `true` if the current value is *not* an array that contains the
   * input value.
   * 
   * Note that this check only works with primitive values; in the future, it 
   * may be expanded to use a deep equality check on each item, but that would
   * be slightly ridiculous.
   */
  excludes(input: unknown) {
    return !this.contains(input);
  }

  /**
   * Returns `true` if the current value is a string that matches the input pattern.
   * Glob patterns, arrays of glob patterns, and RegEx patterns are all supported.
   * 
   * @see {@link https://github.com/micromatch/micromatch Micromatch} for information
   * about supported glob patterns.
   */
  isLike(input: string | string[] | RegExp) {   
    if (!is.string(this.value)) return false;

    if (is.regExp(input)) {
      return input.test(this.value);
    } else {
      return micromatch.isMatch(this.value, input);
    }
  }

  /**
   * Returns `true` if the current value is a string that *does not match* the input.
   * pattern. Glob patterns, arrays of glob patterns, and RegEx patterns are all supported.
   * 
   * @see {@link https://github.com/micromatch/micromatch Micromatch} for information
   * about supported glob patterns.
   */
  notLike(input: string | string[] | RegExp) {
    return !this.isLike(input);
  }

  /**
   * Returns `true` if the current value is a string starts with the input value.
   */
  startsWith(input: string) {
    return is.string(this.value) && this.value.startsWith(input);
  }

  /**
   * Returns `true` if the current value is a string ends with the input value.
   */
  endsWith(input: string) {
    return is.string(this.value) && this.value.endsWith(input);
  }


  /** Convenience aliases **/

  eq = this.isEqualTo;
  neq = this.notEqualTo;
  notEq = this.notEqualTo;
  gt = this.isGreaterThan;
  isGt = this.isGreaterThan;
  lt = this.isLessThan;
  isLt = this.isLessThan;
  bt = this.isBetween;
  isBt = this.isBetween;
  in = this.isIn;
  has = this.contains;
  includes = this.contains;
  like = this.isLike;

  /** Type coercion **/

  asString() {
    if (this.value?.toString) this.value = this.value.toString();
    return this;
  }
  
  /**
   * Converts the current value to a number, if possible.
   * 
   * Percentages (aka, any otherwise-numeric string ending with a percent symbol)
   */
  asNumber() {
    if (is.numericString(this.value)) {
      this.value = Number(this.value);
    } else if (isPercentString(this.value)) {
      this.value = Number(this.value.slice(0,-1)) / 100;
    }
    return this;
  }

  /**
   * Converts the current value to a Date, if possible. Optionally accepts one or
   * more date formatting strings, each of which will be attempted in turn until
   * one returns a valid date object.
   */
  asDate(format?: string | string[]) {
    throw new Error('Not yet implemented.');
    return this;
  }

  /**
   * Wraps the current value in an array if it is not already an array.
   * 
   * @remarks
   * 
   * This can be useful for normalizing parsed data that collapses single-value
   * arrays into bare values.
   */
  asArray() {
    this.value = is.array(this.value) ? this.value : [this.value];
    this.value ??= [];
    return this;
  }

  /** String manipulation **/

  /**
   * Trim whitespace from a string value.
   */
  trim() {
    if (is.string(this.value)) {
      this.value = this.value.trim();
    }
    return this;
  }

  /**
   * Replace patterns in a string with another value. If `searchValue` is a regex
   * with capture groups, `replaceValue` may include the captured text.
   * 
   * @example
   * `p.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1/$2/$3')`
   */
  replace(searchValue: string | RegExp, replaceValue = '') {
    if (is.string(this.value)) {
      this.value = this.value.replaceAll(searchValue, replaceValue);
    }
    return this;
  }
  
  /**
   * Change the capitalization of a string. If no format is specified, `lower` is
   * used. Supported cases include `upper`, `lower`, `first`, `word`, `sentence`,
   * and `title`.
   */
  changeCase(format = 'lower') {
    if (is.string(this.value)) {
      if (format === 'lower') this.value = toCase.lower(this.value);
      else if (format === 'upper') this.value = toCase.upper(this.value);
      else if (format === 'first') this.value = toCase.first(this.value);
      else if (format === 'word') this.value = toCase.capital(this.value);
      else if (format === 'sentence') this.value = toCase.sentence(this.value);
      else if (format === 'title') this.value = toCase.title(this.value);
    }
    return this;
  }
  
  /**
   * Split a string value into an array of values, based on a separator string or RegEx.
   */
  split(separator: string | RegExp = '', limit?: number) {
    if (is.string(this.value)) {
      this.value = this.value.split(separator, limit);
    }
    return this;
  }

  /** HTML / XML parsing and manipulation */

  querySelect = (selector: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  querySelectAll = (selector: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  xslt = (selector: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  attr = (name: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  text = (name: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  markup = (name: string) => {
    throw new Error('Not yet implemented.');
    return this;
  };

  extract = (template: object | object[]) => {
    throw new Error('Not yet implemented.');
    return this;
  }

  /** Array manipulation **/

  /**
   * Sort the items in of an array value.
   * 
   * Note: This function uses Javascript's default sort functions, and will only
   * work with string, number, or date values.
   */
  sort(direction: 'desc' | 'asc') {
    if (is.array(this.value)) {
      this.value.sort();
      if (direction === 'desc') {
        this.value.reverse();
      }
    }
    return this;
  }

  /**
   * Reverse the order of a string, or of items in an array.
   */
  reverse() {
    if (is.array(this.value)) {
      this.value.reverse();
    } else if (is.string(this.value)) {
      this.value = this.value.split('').reverse().join('');
    }
    return this;
  }

  /**
   * Use a glob, regex, or predicate function to remove non-matching
   * items from an array.
   * 
   * Note: Globs and regexes will only work if array items are strings.
   */
  filter(predicate?: string | RegExp | Predicate) {
    if (is.array(this.value)) {
      if (is.array<string>(this.value)) {
        if (is.regExp(predicate)) {
          this.value = this.value.filter(v => predicate.test(v));
        } else if (is.string(predicate)) {
          this.value = this.value.filter(v => micromatch.isMatch(v, predicate))
        }
      }
      else if (is.function(predicate)) {
        this.value = this.value.filter(predicate)
      } else {
        this.value = this.value.filter(Boolean)
      }
    }
    return this;
  }

  join(separator: string = '') {
    if (is.array(this.value)) {
      this.value = this.value.join(separator);
    }
    return this;
  }

  min() {
    if (is.array<number>(this.value) || is.array<string>(this.value) || is.array<Date>(this.value)) {
      this.value = this.value.sort()[0];
    }
    return this;
  }

  max() {
    if (is.array<number>(this.value) || is.array<string>(this.value) || is.array<Date>(this.value)) {
      this.value = this.value.sort().reverse()[0];
    }
    return this;
  }

  first() {
    if (is.array(this.value)) {
      this.value = this.value[0];
    }
    return this;
  }

  last() {
    if (is.array(this.value)) {
      this.value = this.value[this.value.length - 1];
    }
    return this;
  }

  nth(index: number) {
    if (is.array(this.value)) {
      this.value = index < 0 ? this.value[this.value.length - 1 - index] : this.value[index];
    }
    return this;
  }

  /** Array and string manipulation */

  size(humanize = false) {
    if (is.array(this.value)) {
      this.value = humanize ? `${this.value.length.toLocaleString()} items` : this.value.length;
    } else if (is.set(this.value) || is.map(this.value)) {
      this.value = humanize ? `${this.value.size.toLocaleString()} items` : this.value.size;
    } else if (is.string(this.value)) {
      this.value = humanize ? `${this.value.length.toLocaleString()} characters` : this.value.length;
    } else if (is.buffer(this.value)) {
      this.value = humanize ? prettyBytes(this.value.byteLength) : this.value.byteLength;
    }
    return this;
  }

  slice(start?: number, end?: number) {
    if (is.array(this.value)) {
      this.value = this.value.slice(start, end);
    }
    return this;
  }

  limit(length: number) {
    return this.slice(0, length);
  }

  /** Number manipulation */

  round() {
    if (is.number(this.value)) {
      this.value = Math.round(this.value)
    }
    return this;
  }

  ceil() {
    if (is.number(this.value)) {
      this.value = Math.ceil(this.value)
    }
    return this;
  }

  floor() {
    if (is.number(this.value)) {
      this.value = Math.floor(this.value)
    }
    return this;
  }
}