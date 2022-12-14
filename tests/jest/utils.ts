import { expect } from "@jest/globals";

export function expectToBeObject(symbol: any): symbol is Record<string, any> & Record<number, any> {
  expect(typeof symbol).toStrictEqual('object');
  return true;
}