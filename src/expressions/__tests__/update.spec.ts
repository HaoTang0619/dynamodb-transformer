import { NSet, SSet } from '../../type';
import { Expressions } from '../type';
import update, { LIST_APPEND, PATH } from '../update/index';

const expressions: Expressions = {
  counter: 0,
  ExpressionAttributeNames: {},
  ExpressionAttributeValues: {},
  extraReservedWords: ['nested.test', 'random.one'],
  updated: {},
};

test('update_set1', () => {
  const set1Test = update('set', { abc: 123, test: '456' });
  set1Test(expressions, 'metadata');
  expect(expressions.ExpressionAttributeValues?.[':v_0']).toStrictEqual({
    M: { abc: { N: '123' }, test: { S: '456' } },
  });
  expect(expressions.updated?.set?.[0]).toBe('metadata = :v_0');
});

test('update_set2', () => {
  const set2Test = update('set', PATH('metadata'));
  set2Test(expressions, 'metadata');
  expect(expressions.updated?.set?.[1]).toBe('metadata = metadata');
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

test('update_set3', () => {
  const set2Test = update('set', LIST_APPEND('shipping', [1, 2, 3]));
  set2Test(expressions, 'shipping');
  expect(expressions.updated?.set?.[2]).toBe(
    'shipping = list_append(shipping, :v_4)',
  );
  expect(expressions.ExpressionAttributeValues?.[':v_4']).toStrictEqual({
    L: [{ N: '1' }, { N: '2' }, { N: '3' }],
  });
});
