import is, { Predicate, Primitive, TypeName } from '@sindresorhus/is';
import { ObjectProxy, PropertyProxy, SortablePrimitive } from './types.js';
import { getValue } from './functions/get-value.js';
import * as dot from './functions/dot.js';
import { isEmpty } from './functions/is-empty.js';
import { isMatch } from 'micromatch';

export class Property implements PropertyProxy {
  constructor(object: ObjectProxy, path: string) {
    this.path = path;
    this.object = object;
    this._value = getValue(object, path);
  }

  readonly object: ObjectProxy
  readonly path: string
  private _value: unknown;

  get value(): unknown {
    this._value = getValue(this.object, this.path);
    return this._value;
  }

  get type() {
    return is(this._value);
  }


  /** Type checking, equality, and comparisons **/

  is(input: TypeName) {
    return is(this._value).toLocaleLowerCase() === input.toLocaleLowerCase();
  }

  isNot(input: TypeName) {
    return !this.is(input);
  }

  empty() {
    return isEmpty(this._value, this.object.options);
  }

  notEmpty() {
    return !this.empty();
  }

  isEqualTo(input: unknown): boolean {
    return dot.equals(input, this._value)
  }

  notEqualTo(input: unknown) {
    return !this.eq(input);
  }

  isGreaterThan(input: SortablePrimitive) {
    throw new Error('Not yet implemented');
    return true;
  }

  isLessThan(input: SortablePrimitive) {
    throw new Error('Not yet implemented');
    return true;
  }

  isBetween(min: SortablePrimitive, max: SortablePrimitive) {
    throw new Error('Not yet implemented');
    return true;
  }

  notBetween(min: SortablePrimitive, max: SortablePrimitive)  {
    return !this.isBetween(min, max);
  }

  isIn(input: Primitive[]) {
    if (!is.primitive(this._value)) return false;
    return input.includes(this._value);
  }

  notIn(input: Primitive[]) {
    return !this.isIn(input);
  }

  contains(input: unknown) {
    if (!is.array(this._value)) return false;
    return this._value.includes(input);
  }

  excludes(input: unknown) {
    return !this.contains(input);
  }

  isLike(input: string | string[] | RegExp) {   
    if (!is.string(this._value)) return false;

    if (is.regExp(input)) {
      return input.test(this._value);
    } else {
      return isMatch(this._value, input);
    }

    return false;
  }

  notLike(input: string | string[] | RegExp) {
    return !this.isLike(input);
  }

  /** Convenience aliases **/

  eq = this.isEqualTo;
  notEq = this.notEqualTo;
  gt = this.isGreaterThan;
  isGt = this.isGreaterThan;
  lt = this.isLessThan;
  isLt = this.isLessThan;
  bt = this.isBetween;
  isBt = this.isBetween;

  /** Type coercion **/

  asString() {
    if (this._value?.toString) this._value = this._value.toString();
    return this;
  }

  asNumber() {
    if (is.numericString(this._value)) {
      this._value = Number(this._value);
    }
    return this;
  }

  asDate() {
    return this;
  }

  asArray() {
    this._value ??= is.array(this._value) ? this._value : [this._value];
    this._value ??= [];
    return this;
  }

  /** String manipulation **/

  changeCase(format: string) {
    return this;
  }

  split(separator: string | RegExp = '') {
    return this;
  }

  /** HTML / XML parsing and manipulation */

  querySelect(selector: string) {
    return this;
  }

  querySelectAll(selector: string) {
    return this;
  }

  attr(name: string) {
    return this;
  }

  xslt(selector: string) {
    return this;
  }

  extract(template: object | object[]) {
    return this;
  }

  /** Array manipulation **/

  sort(direction: 'desc' | 'asc') {
    if (is.array(this._value)) {
      this._value.sort();
      if (direction === 'desc') {
        this._value.reverse();
      }
    }
    return this;
  }

  reverse() {
    if (is.array(this._value)) {
      this._value.reverse();
    }
    return this;
  }

  filter(predicate?: string | RegExp | Predicate) {
    if (is.array(this._value)) {
      if (is.array<string>(this._value)) {
        if (is.regExp(predicate)) {
          this._value = this._value.filter(v => predicate.test(v));
        } else if (is.string(predicate)) {
          this._value = this._value.filter(v => isMatch(v, predicate))
        }
      }
      else if (is.function(predicate)) {
        this._value = this._value.filter(predicate)
      } else {
        this._value = this._value.filter(Boolean)
      }  
    }
    return this;
  }

  join(separator: string = '') {
    if (is.array(this._value)) {
      this._value = this._value.join(separator);
    }
    return this;
  }

  min() {
    if (is.array<number>(this._value) || is.array<string>(this._value) || is.array<Date>(this._value)) {
      this._value = this._value.sort()[0];
    }
    return this;
  }

  max() {
    if (is.array<number>(this._value) || is.array<string>(this._value) || is.array<Date>(this._value)) {
      this._value = this._value.sort().reverse()[0];
    }
    return this;
  }

  first() {
    if (is.array(this._value)) {
      this._value = this._value[0];
    }
    return this;
  }

  last() {
    if (is.array(this._value)) {
      this._value = this._value[this._value.length - 1];
    }
    return this;
  }

  nth(index: number) {
    if (is.array(this._value)) {
      this._value = index < 0 ? this._value[this._value.length - 1 - index] : this._value[index];
    }
    return this;
  }

  /** Array and string manipulation */

  size(friendly = false) {
    if (is.array(this._value)) {
      this._value = friendly ? `${this._value.length.toLocaleString()} items` : this._value.length;
    }
    if (is.set(this._value) || is.map(this._value)) {
      this._value = friendly ? `${this._value.size.toLocaleString()} items` : this._value.size;
    }
    if (is.string(this._value)) {
      this._value = friendly ? `${this._value.length.toLocaleString()} characters` : this._value.length;
    }
    if (is.buffer(this._value)) {
      this._value = friendly ? `${this._value.byteLength.toLocaleString()} bytes` : this._value.byteLength;
    }
    return this;
  }

  slice(start?: number, end?: number) {
    if (is.array(this._value)) {
      this._value = this._value.slice(start, end);
    }
    return this;
  }

  limit(length: number) {
    return this.slice(0, length);
  }


  /** Number manipulation */

  round() {
    if (is.number(this._value)) {
      this._value = Math.round(this._value)
    }
    return this;
  }

  ceil() {
    if (is.number(this._value)) {
      this._value = Math.ceil(this._value)
    }
    return this;
  }

  floor() {
    if (is.number(this._value)) {
      this._value = Math.floor(this._value)
    }
    return this;
  }
}