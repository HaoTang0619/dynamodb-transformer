/* eslint-disable no-console-log/no-console-log */
import {
  BatchGetItemCommand,
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshaler, unmarshaler } from 'dynamodb-transformer';
import dataSetToExpressions from 'dynamodb-transformer/expressions';
import { ATTRIBUTE_NOT_EXISTS, NE } from 'dynamodb-transformer/operate';

const dynamoDB = new DynamoDBClient({});

const TableName = '';
const key = { id: '' };
const keys = Array.from({ length: 10 }).map(() => key);
const condition = { id: '', test: '' };
const item = {
  id: '49111451611ff68dff8ccda24b43795d3f2747f99678db0b59424a7915a1d825',
  amount: 129000,
  // list: [{ brand: 'amex', processor: { id: '123', name: 'stripe' } }],
  url: null,
};

// BatchGetItem
async () => {
  const expressions = dataSetToExpressions({
    projection: Object.keys(condition),
  });

  const result = await dynamoDB.send(
    new BatchGetItemCommand({
      RequestItems: {
        [TableName]: {
          Keys: keys.map((key) => marshaler(key)),
          ...expressions,
        },
      },
    }),
  );
  return result?.Responses?.[TableName]?.map(unmarshaler);
};

// DeleteItem
async () => {
  const result = await dynamoDB.send(
    new DeleteItemCommand({
      TableName,
      Key: marshaler(key),
      ReturnValues: 'ALL_OLD',
    }),
  );
  return unmarshaler(result?.Attributes || {});
};

// GetItem
async () => {
  const result = await dynamoDB.send(
    new GetItemCommand({ TableName, Key: marshaler(key) }),
  );
  const data = unmarshaler(result?.Item || {});
  return !!data?.disabled ? {} : data;
};

// PutItem
async () => {
  const expressions = dataSetToExpressions({
    condition: { pKey: ATTRIBUTE_NOT_EXISTS() },
  });

  await dynamoDB.send(
    new PutItemCommand({
      TableName,
      Item: marshaler(item),
      ...expressions,
    }),
  );
  return item;
};

// Query
async () => {
  const expressions = dataSetToExpressions({
    filter: { disabled: NE(true) },
    keyCondition: key,
    projection: Object.keys(condition),
  });

  const resultItems: any[] = [];
  let LastEvaluatedKey: any = null;
  do {
    const result = await dynamoDB.send(
      new QueryCommand({
        TableName,
        IndexName: 'name-index',
        ...expressions,
        ScanIndexForward: false,
        Limit: 10,
        ...(!!LastEvaluatedKey ? { ExclusiveStartKey: LastEvaluatedKey } : {}),
      }),
    );

    resultItems.push(...(result?.Items || []));
    LastEvaluatedKey = result.LastEvaluatedKey;
  } while (!!LastEvaluatedKey);

  return resultItems?.map(unmarshaler);
};

// Scan
async () => {
  const expressions = dataSetToExpressions({
    filter: condition,
    projection: Object.keys(condition),
  });

  const scanCommand = new ScanCommand({
    TableName,
    ...expressions,
  });

  const results: any[] = [];
  do {
    const result = await dynamoDB.send(scanCommand);
    results.push(...(result?.Items || []));
    if (result.LastEvaluatedKey) {
      scanCommand.input.ExclusiveStartKey = result.LastEvaluatedKey;
    } else break;
  } while (true);

  return results.map(unmarshaler);
};

// UpdateItem
async () => {
  const delta = { ...item, updated: Math.floor(+new Date() / 1000) };

  const expressions = dataSetToExpressions({
    condition,
    update: delta,
  });

  const result = await dynamoDB.send(
    new UpdateItemCommand({
      TableName,
      Key: marshaler(key),
      ReturnValues: 'ALL_NEW',
      ...expressions,
    }),
  );
  return unmarshaler(result?.Attributes || {});
};
