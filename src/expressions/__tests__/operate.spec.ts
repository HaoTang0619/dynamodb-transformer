import operate from '../operate';
import { Expressions } from '../type';

const expressions: Expressions = {
  counter: 0,
  ExpressionAttributeNames: {},
  ExpressionAttributeValues: {},
  extraReservedWords: ['nested.test', 'random.one'],
};

test('operate_comparator', () => {
  const compareTest = operate('<>', 123);
  expect(compareTest(expressions, 'nested.test.child')).toBe(
    '#n_0.child <> :v_1',
  );
  expect(expressions.counter).toBe(2);
  expect(expressions.ExpressionAttributeNames?.['#n_0']).toBe('nested.test');
  expect(expressions.ExpressionAttributeValues?.[':v_1']).toStrictEqual({
    N: '123',
  });
});

test('operate_between', () => {
  const betweenTest = operate('between', ['a', 'z']);
  expect(betweenTest(expressions, 'keyBetween')).toBe(
    'keyBetween BETWEEN :v_2 AND :v_3',
  );
  expect(expressions.counter).toBe(4);
  expect(expressions.ExpressionAttributeValues?.[':v_2']).toStrictEqual({
    S: 'a',
  });
  expect(expressions.ExpressionAttributeValues?.[':v_3']).toStrictEqual({
    S: 'z',
  });
});

test('operate_in', () => {
  const inTest = operate('in', [10, 20]);
  expect(inTest(expressions, 'parent[0].random.one')).toBe(
    'parent[0].#n_4 IN (:v_5, :v_6)',
  );
  expect(expressions.counter).toBe(7);
  expect(expressions.ExpressionAttributeNames?.['#n_4']).toBe('random.one');
  expect(expressions.ExpressionAttributeValues?.[':v_5']).toStrictEqual({
    N: '10',
  });
  expect(expressions.ExpressionAttributeValues?.[':v_6']).toStrictEqual({
    N: '20',
  });
});

test('operate_func_1', () => {
  const func1Test = operate('attribute_exists');
  expect(func1Test(expressions, 'nested.test.random.one[1]')).toBe(
    'attribute_exists(#n_8.#n_7[1])',
  );
  expect(expressions.counter).toBe(9);
  expect(expressions.ExpressionAttributeNames?.['#n_7']).toBe('random.one');
  expect(expressions.ExpressionAttributeNames?.['#n_8']).toBe('nested.test');
});

test('operate_func_2', () => {
  const func2Test = operate('attribute_type', 'B');
  expect(func2Test(expressions, 'nested.test[2].random.one')).toBe(
    'attribute_type(#n_10[2].#n_9, :v_11)',
  );
  expect(expressions.counter).toBe(12);
  expect(expressions.ExpressionAttributeNames?.['#n_9']).toBe('random.one');
  expect(expressions.ExpressionAttributeNames?.['#n_10']).toBe('nested.test');
  expect(expressions.ExpressionAttributeValues?.[':v_11']).toStrictEqual({
    S: 'B',
  });
});
