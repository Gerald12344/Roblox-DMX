let values: { id: number; values: number[] }[] = [];

export function setValues(x: { id: number; values: number[] }[]) {
  values = x;
}

export { values };
