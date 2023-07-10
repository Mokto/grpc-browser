

const BYTES_COUNT = 4;

export const getRandomUint32 = () => {
  return Math.floor(Math.random() * Math.pow(256, BYTES_COUNT));
}

export const numToUint8Array = (num: number) => {
  let arr = new Uint8Array(4);

  for (let i = 0; i < 4; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
}
export const uint8ArrayToNum = (arr: Uint8Array) => {
    const viewOperationId = new DataView(arr.buffer, 0);
    return viewOperationId.getUint32(0, true);
}