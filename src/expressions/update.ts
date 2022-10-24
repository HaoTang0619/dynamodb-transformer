import { BSet, NSet, SSet, Unmarshalled } from '../type';
import { Expressions } from './type';
import { UpdateFuncParams, UpdateParams, UpdateResult } from './update.type';
import { addAttr, addNameAttr } from './utils';

const appendUpdated = (
  expression: Expressions,
  updater: 'set' | 'remove' | 'add' | 'delete',
  str: string,
) => {
  expression.updated = {
    ...expression.updated,
    [updater]: [...(expression[updater] || []), str],
  };
};

const updateFunc = (...params: UpdateFuncParams): void => {
  const [expressions, updater, name, value] = params;

  const nameAttr = addNameAttr(expressions, name);
  let valueAttr = '';
  if (value !== undefined) {
    valueAttr = addAttr(expressions, value, 'value');
  }

  if (updater === 'set') {
    appendUpdated(expressions, 'set', `${nameAttr} = ${valueAttr}`);
  } else if (updater === 'remove') {
    appendUpdated(expressions, 'remove', nameAttr);
  } else {
    appendUpdated(expressions, updater, `${nameAttr} ${valueAttr}`);
  }
};

const update = (...params: UpdateParams): UpdateResult => {
  const [updater, value] = params;

  return (expressions: Expressions, name: string) => {
    const funcParams = [expressions, updater, name, value] as UpdateFuncParams;
    return updateFunc(...funcParams);
  };
};

export default update;
export const SET = (value: Unmarshalled) => update('set', value);
export const REMOVE = () => update('remove');
export const ADD = (value: number | BSet | NSet | SSet) => update('add', value);
export const DELETE = (value: BSet | NSet | SSet) => update('delete', value);
