const filterUniqueByKey = (arr: any[], key: string) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};
export default filterUniqueByKey;
