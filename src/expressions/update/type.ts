import { BSet, NSet, SSet, Unmarshalled } from '../../type';
import { Expressions } from '../type';

export const SYMBOL_IF_NOT_EXISTS: unique symbol = Symbol.for('if_not_exists');
export const SYMBOL_LIST_APPEND: unique symbol = Symbol.for('list_append');
export const SYMBOL_PATH: unique symbol = Symbol.for('path');

export type SetFuncParams =
  | ['if_not_exists', string, Unmarshalled]
  | ['list_append', string, Unmarshalled[]]
  | ['path', string];

export type SetFuncResult =
  | [typeof SYMBOL_IF_NOT_EXISTS, string, Unmarshalled]
  | [typeof SYMBOL_LIST_APPEND, string, Unmarshalled[]]
  | [typeof SYMBOL_PATH, string];

export type SetParams = Unmarshalled | SetFuncResult;

// [expressions, updater, name, value]
export type UpdateFuncParams =
  | [Expressions, 'set', string, SetParams]
  | [Expressions, 'remove', string]
  | [Expressions, 'add', string, number | BSet | NSet | SSet]
  | [Expressions, 'delete', string, BSet | NSet | SSet];

// [updater, value]
export type UpdateParams =
  | ['set', SetParams]
  | ['remove']
  | ['add', number | BSet | NSet | SSet]
  | ['delete', BSet | NSet | SSet];

export type UpdateResult = (expressions: Expressions, name: string) => void;
