import {
  LogicalParams,
  PlainData,
  SYMBOL_AND,
  SYMBOL_NOT,
  SYMBOL_OR,
} from './type';

const logical = (...params: LogicalParams): PlainData => {
  const [operator, data] = params;

  if (operator === 'and') return [SYMBOL_AND, data];
  if (operator === 'or') return [SYMBOL_OR, data];
  return [SYMBOL_NOT, data as PlainData];
};

export default logical;
