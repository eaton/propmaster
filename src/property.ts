import is from '@sindresorhus/is';
import { Propmaster } from './propmaster';

export class Property {
  constructor(protected object: Propmaster, protected path: string) { }

  ifAny() {}
  ifAll() {}
  ifNone() {}

  get value(): unknown {
    return this.object.getValue(this.path);
  }
}