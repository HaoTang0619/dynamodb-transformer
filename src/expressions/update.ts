import { addAttr, addNameAttr } from './operate';
import {
  Expressions,
  UpdateFuncParams,
  UpdateParams,
  UpdateResult,
} from './type';

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
