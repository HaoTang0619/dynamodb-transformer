import {
  Expressions,
  NonEmptyArr,
  OperateFuncParams,
  OperateParams,
  OperateResult,
} from './type';
import { addAttr, addNameAttr } from './utils';

const operateFunc = (...params: OperateFuncParams): string => {
  const [expressions, operator, name, value] = params;

  const nameAttr = addNameAttr(expressions, name);

  let valueAttr: string | string[] = '';
  if (value !== undefined) {
    if (Array.isArray(value)) {
      valueAttr = value.map(
        (val: Uint8Array | boolean | number | null | string) =>
          addAttr(expressions, val, 'value'),
      );
    } else valueAttr = addAttr(expressions, value, 'value');
  }

  if (['=', '<', '<=', '>', '>=', '<>'].includes(operator)) {
    return `${nameAttr} ${operator} ${valueAttr}`;
  } else if (operator === 'between') {
    return `${nameAttr} BETWEEN ${valueAttr[0]} AND ${valueAttr[1]}`;
  } else if (operator === 'in') {
    return `${nameAttr} IN (${(valueAttr as string[]).join(', ')})`;
  } else if (
    ['attribute_exists', 'attribute_not_exists', 'size'].includes(operator)
  ) {
    return `${operator}(${nameAttr})`;
  } else if (['attribute_type', 'begins_with', 'contains'].includes(operator)) {
    return `${operator}(${nameAttr}, ${valueAttr})`;
  }

  return '';
};

const operate = (...params: OperateParams): OperateResult => {
  const [operator, value] = params;

  return (expressions: Expressions, name: string) => {
    const funcParams = [
      expressions,
      operator,
      name,
      value,
    ] as OperateFuncParams;
    return operateFunc(...funcParams);
  };
};

export default operate;
export const EQ = (value: Uint8Array | boolean | number | null | string) =>
  operate('=', value);
export const NE = (value: Uint8Array | boolean | number | null | string) =>
  operate('<>', value);
export const LE = (value: Uint8Array | number | string) => operate('<=', value);
export const LT = (value: Uint8Array | number | string) => operate('<', value);
export const GE = (value: Uint8Array | number | string) => operate('>=', value);
export const GT = (value: Uint8Array | number | string) => operate('>', value);
export const BETWEEN = (
  value: [Uint8Array, Uint8Array] | [number, number] | [string, string],
) => operate('between', value);
export const IN = (
  value: NonEmptyArr<Uint8Array | boolean | number | null | string>,
) => operate('in', value);
export const ATTRIBUTE_EXISTS = () => operate('attribute_exists');
export const ATTRIBUTE_NOT_EXISTS = () => operate('attribute_not_exists');
export const ATTRIBUTE_TYPE = (
  value: 'B' | 'BOOL' | 'BS' | 'L' | 'M' | 'N' | 'NS' | 'NULL' | 'S' | 'SS',
) => operate('attribute_type', value);
export const BEGINS_WITH = (value: Uint8Array | string) =>
  operate('begins_with', value);
export const CONTAINS = (
  value: Uint8Array | boolean | number | null | string,
) => operate('contains', value);
export const SIZE = () => operate('size');
