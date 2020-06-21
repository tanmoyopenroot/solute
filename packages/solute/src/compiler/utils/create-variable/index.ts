const counter = {};

export default (name: string): string => {
  if (!counter[name]) {
    counter[name] = 0;
  }

  return `${name}${++counter[name]}`;
};
