export const GUID = (() => {
  let count = 0;
  return (): string => {
    return (++count).toString();
  };
})();
