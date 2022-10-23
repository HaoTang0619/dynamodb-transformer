import operate from './operate';
import { DataSetToExpressionsParams, Expressions, PlainData } from './type';

const getExpressions = (expressions: Expressions, data: PlainData): string => {
  if (Array.isArray(data)) {
    if (data[0].description === 'AND') {
      return (data[1] as any)
        .map((d: PlainData) => `(${getExpressions(expressions, d)})`)
        .join(' AND ');
    }
    if (data[0].description === 'OR') {
      return (data[1] as any)
        .map((d: PlainData) => `(${getExpressions(expressions, d)})`)
        .join(' OR ');
    }
    return `NOT (${getExpressions(expressions, data[1] as PlainData)})`;
  }

  const expressionStrings = Object.entries(data).map(([name, op]) => {
    let opFunc = op;
    if (typeof opFunc !== 'function') {
      opFunc = operate(
        '=',
        op as Uint8Array | boolean | number | null | string,
      );
    }

    return opFunc(expressions, name);
  });

  return expressionStrings.join(' AND ');
};

const dataSetToExpressions = (
  dataSet: DataSetToExpressionsParams,
): Omit<Expressions, 'counter' | 'extraReservedWords'> => {
  const { extraReservedWords = [] } = dataSet;

  const expressions: Expressions = {
    counter: 0,
    ExpressionAttributeNames: {},
    ExpressionAttributeValues: {},
    extraReservedWords,
  };

  if (!!dataSet.condition) {
    expressions.ConditionExpression = getExpressions(
      expressions,
      dataSet.condition,
    );
  }

  if (!!dataSet.filter) {
    expressions.FilterExpression = getExpressions(expressions, dataSet.filter);
  }

  if (!!dataSet.keyCondition) {
    expressions.KeyConditionExpression = getExpressions(
      expressions,
      dataSet.keyCondition,
    );
  }

  if (!!dataSet.update) {
    expressions.UpdateExpression = getExpressions(expressions, dataSet.update);
  }

  delete expressions.counter;
  delete expressions.extraReservedWords;
  Object.keys(expressions).forEach((exp) => {
    if (!expressions[exp] || Object.keys(expressions[exp])?.length === 0) {
      delete expressions[exp];
    }
  });

  return expressions;
};

export default dataSetToExpressions;
