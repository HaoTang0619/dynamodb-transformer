import { Marshalled } from '../type';

export type Expressions = {
  ConditionExpression?: string;
  counter?: number; // Would be omitted when returned.
  ExpressionAttributeNames?: { [key: string]: string };
  ExpressionAttributeValues?: { [key: string]: Marshalled };
  extraReservedWords?: string[]; // Would be omitted when returned.
  FilterExpression?: string;
  KeyConditionExpression?: string;
  ProjectionExpression?: string;
  UpdateExpression?: string;
};

export type AddAttrParams =
  | [Expressions, string]
  | [Expressions, Uint8Array | boolean | number | null | string, 'value'];

type NonEmptyArr<T> = [T, ...T[]];

// [expressions, operator, name, value]
export type OperateFuncParams =
  | [
      Expressions,
      '=' | '<>' | '<' | '<=' | '>' | '>=',
      string,
      Uint8Array | number | string,
    ]
  | [Expressions, '=' | '<>', string, boolean | null]
  | [
      Expressions,
      'between',
      string,
      [Uint8Array, Uint8Array] | [number, number] | [string, string],
    ]
  | [
      Expressions,
      'in',
      string,
      NonEmptyArr<Uint8Array | boolean | number | null | string>,
    ]
  | [Expressions, 'attribute_exists' | 'attribute_not_exists' | 'size', string]
  | [
      Expressions,
      'attribute_type',
      string,
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | [Expressions, 'begins_with', string, Uint8Array | string]
  | [
      Expressions,
      'contains',
      string,
      Uint8Array | boolean | number | null | string,
    ];

// [operator, value]
export type OperateParams =
  | ['=' | '<>' | '<' | '<=' | '>' | '>=', Uint8Array | number | string]
  | ['=' | '<>', boolean | null]
  | ['between', [Uint8Array, Uint8Array] | [number, number] | [string, string]]
  | ['in', NonEmptyArr<Uint8Array | boolean | number | null | string>]
  | ['attribute_exists' | 'attribute_not_exists' | 'size']
  | [
      'attribute_type',
      'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
    ]
  | ['begins_with', Uint8Array | string]
  | ['contains', Uint8Array | boolean | number | null | string];

export type OperateResult = (expressions: Expressions, name: string) => string;

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

export type LogicalParams =
  | ['and' | 'or', NonEmptyArr<PlainData>]
  | ['not', PlainData];

export type DataSetToExpressionsParams = {
  condition?: PlainData;
  extraReservedWords?: string[];
  filter?: PlainData;
  keyCondition?: PlainData;
  update?: PlainData;
};
