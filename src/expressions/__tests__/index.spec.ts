import dataSetToExpressions from '../index';
import { AND, OR } from '../logical/index';
import { ATTRIBUTE_EXISTS, NE } from '../operate/index';
import { ADD, PATH } from '../update/index';

test('dataSet1', () => {
  const result = dataSetToExpressions({
    condition: OR([
      { abc: '123', def: 0 },
      AND([{ abc: NE(null) }, { name: ATTRIBUTE_EXISTS() }]),
    ]),
    update: { 'name.child[2]': ADD(1), balance: PATH('frozen') },
  });

  expect(result).toStrictEqual({
    ExpressionAttributeNames: { '#n_3': 'name', '#n_4': 'name' },
    ExpressionAttributeValues: {
      ':v_0': { S: '123' },
      ':v_1': { N: '0' },
      ':v_2': { NULL: true },
      ':v_5': { N: '1' },
    },
    ConditionExpression:
      '(abc = :v_0 AND def = :v_1) OR ((abc <> :v_2) AND (attribute_exists(#n_3)))',
    UpdateExpression: 'ADD #n_4.child[2] :v_5 SET balance = frozen',
  });
});
