import { Marshalled, Unmarshalled } from '../type';
import { OperateResult } from './operate.type';
import { UpdateResult } from './update.type';

export type Expressions = {
  ConditionExpression?: string;
  counter?: number; // Would be omitted when returned.
  ExpressionAttributeNames?: { [key: string]: string };
  ExpressionAttributeValues?: { [key: string]: Marshalled };
  extraReservedWords?: string[]; // Would be omitted when returned.
  FilterExpression?: string;
  KeyConditionExpression?: string;
  ProjectionExpression?: string;
  updated?: {
    set?: string[];
    remove?: string[];
    add?: string[];
    delete?: string[];
  }; // Would be omitted when returned.
  UpdateExpression?: string;
};

export type NonEmptyArr<T> = [T, ...T[]];

type PlainValues =
  | Uint8Array
  | boolean
  | number
  | null
  | string
  | OperateResult;

export const SYMBOL_AND: unique symbol = Symbol.for('AND');
export const SYMBOL_OR: unique symbol = Symbol.for('OR');
export const SYMBOL_NOT: unique symbol = Symbol.for('NOT');

export type PlainData =
  | { [name: string]: PlainValues }
  | [typeof SYMBOL_AND, NonEmptyArr<PlainData>]
  | [typeof SYMBOL_OR, NonEmptyArr<PlainData>]
  | [typeof SYMBOL_NOT, PlainData];

type UpdateValues = Unmarshalled | UpdateResult;

export type UpdateData = {
  [name: string]: UpdateValues;
};

export type DataSetToExpressionsParams = {
  condition?: PlainData;
  extraReservedWords?: string[];
  filter?: PlainData;
  keyCondition?: PlainData;
  projection?: string[];
  update?: UpdateData;
};
