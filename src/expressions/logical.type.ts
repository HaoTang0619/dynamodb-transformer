import { PlainData, PlainDataArr } from './type';

export type LogicalParams = ['and' | 'or', PlainDataArr] | ['not', PlainData];
