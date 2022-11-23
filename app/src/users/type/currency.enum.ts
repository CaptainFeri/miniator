export enum currencyTypeEnum {
  DOLLAR,
  RIAL,
  POND,
}

export async function getCurrencies(): Promise<number[]> {
  return [0, 1, 2];
}
