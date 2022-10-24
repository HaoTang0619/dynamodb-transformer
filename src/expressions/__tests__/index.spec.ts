import dataSetToExpressions from '../index';
import { AND, OR } from '../logical';
import { ATTRIBUTE_EXISTS, NE } from '../operate';
import { ADD } from '../update';

test('dataSet1', () => {
  const result = dataSetToExpressions({
    condition: OR([
      { abc: '123', def: 0 },
      AND([{ abc: NE(null) }, { name: ATTRIBUTE_EXISTS() }]),
    ]),
    update: { ghi: ADD(1) },
  });

  expect(result).toStrictEqual({
    ExpressionAttributeNames: { '#n_3': 'name' },
    ExpressionAttributeValues: {
      ':v_0': { S: '123' },
      ':v_1': { N: '0' },
      ':v_2': { NULL: true },
      ':v_4': { N: '1' },
    },
    ConditionExpression:
      '(abc = :v_0 AND def = :v_1) OR ((abc <> :v_2) AND (attribute_exists(#n_3)))',
    UpdateExpression: 'ADD ghi :v_4',
  });
});
