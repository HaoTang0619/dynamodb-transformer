/* eslint-disable no-console-log/no-console-log */
import dataSetToExpressions from 'dynamodb-transformer/expressions';
import { ATTRIBUTE_EXISTS } from 'dynamodb-transformer/operate';
import { ADD } from 'dynamodb-transformer/update';

const log = (toLog: Record<string, any>) =>
  console.log(JSON.stringify(toLog, undefined, 2));

log(
  dataSetToExpressions({
    condition: { attr: 0, col: ATTRIBUTE_EXISTS() },
    keyCondition: { uuid: '0000-0000', created: +new Date() - 100 },
    projection: ['uuid', 'updated'],
    update: { attr: ADD(10), updated: +new Date() },
  }),
);
