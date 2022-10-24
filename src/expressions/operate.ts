import marshaler from '../marshaler';
import RESERVED_WORDS from './reserved_words';
import {
  AddAttrParams,
  Expressions,
  NonEmptyArr,
  OperateFuncParams,
  OperateParams,
  OperateResult,
} from './type';

export const addAttr = (...params: AddAttrParams): string => {
  const [expressions, nameVal, type = 'name'] = params;

  let { counter = 0 } = expressions;
  let key: string;

  if (type === 'name') {
    key = `#n_${counter++}`;
    (expressions.ExpressionAttributeNames as any)[key] = nameVal;
  } else {
    key = `:v_${counter++}`;
    expressions.ExpressionAttributeValues = {
      ...expressions.ExpressionAttributeValues,
      ...marshaler({ [key]: nameVal }),
    };
  }

  expressions.counter = counter;
  return key;
};

const addNameAttrOfEach = (
  expressions: Expressions,
  name: string,
  word: string,
): string => {
  if (!word) return name;

  let newName = name;
  let nameAttr: string;

  const nameSegment = name.split(word);
  if (nameSegment.length > 1) {
    newName = nameSegment.reduce((acc, cur, idx) => {
      if (idx === 0) return cur;
      const prev = nameSegment[idx - 1];
      if (
        /^$|\.$/.test(prev) &&
        /^$|^\.|^\[0\]|^\[[1-9]\d*\]/.test(cur) // Array syntax regex: /(\[0\]|\[[1-9]\d*\])/
      ) {
        nameAttr = nameAttr || addAttr(expressions, word);
        return `${acc}${nameAttr}${cur}`;
      }
      return `${acc}${word}${cur}`;
    }, '');
  }

  return newName;
};

export const addNameAttr = (expressions: Expressions, name: string): string => {
  // Step 1 ~ replace "extraReservedWords":
  const { extraReservedWords = [] } = expressions;
  let newName = name;
  extraReservedWords.forEach((word) => {
    newName = addNameAttrOfEach(expressions, newName, word);
  });

  // Step 2 ~ split by ".":
  newName = newName
    .split('.')
    .map((nameSegment) => {
      // Array syntax regex: /(\[0\]|\[[1-9]\d*\])/
      // => spl[0] would be the name (of an array)
      const spl = nameSegment.split(/(\[0\]|\[[1-9]\d*\])/);
      if (
        RESERVED_WORDS.includes(spl[0].toLocaleUpperCase()) ||
        /[0-9]/.test(spl[0][0]) ||
        /[ .-]/.test(spl[0])
      ) {
        const nameAttr = addAttr(expressions, spl[0]);
        spl[0] = nameAttr;
      }
      return spl.join('');
    })
    .join('.');

  return newName;
};

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
