import { NSet, SSet } from '../../type';
import { Expressions } from '../type';
import update from '../update';

const expressions: Expressions = {
  counter: 0,
  ExpressionAttributeNames: {},
  ExpressionAttributeValues: {},
  extraReservedWords: ['nested.test', 'random.one'],
};

test('update_set', () => {
  const setTest = update('set', { abc: 123, test: '456' });
  setTest(expressions, 'metadata');
  expect(expressions.ExpressionAttributeValues?.[':v_0']).toStrictEqual({
    M: { abc: { N: '123' }, test: { S: '456' } },
  });
  expect(expressions.updated?.set).toStrictEqual(['metadata = :v_0']);
});

test('update_remove', () => {
  const removeTest = update('remove');
  removeTest(expressions, 'uuid');
  expect(expressions.ExpressionAttributeNames?.['#n_1']).toBe('uuid');
  expect(expressions.updated?.remove).toStrictEqual(['#n_1']);
});

test('update_add', () => {
  const addTest = update('add', new NSet([1, 2]));
  addTest(expressions, 'num_set');
  expect(expressions.ExpressionAttributeValues?.[':v_2']).toStrictEqual({
    NS: ['1', '2'],
  });
});

test('update_delete', () => {
  const deleteTest = update('delete', new SSet(['a', 'b']));
  deleteTest(expressions, 'str_set');
  expect(expressions.ExpressionAttributeValues?.[':v_3']).toStrictEqual({
    SS: ['a', 'b'],
  });
});
