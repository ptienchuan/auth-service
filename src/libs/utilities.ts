const extractObject = <T, K extends keyof T>(
  resource: T,
  properties: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  properties.forEach((property) => {
    if (property in resource) {
      result[property] = resource[property];
    }
  });

  return result;
};

const log = (message: string, meta?: any): void => {
  const isTestEnv = process.env.NODE_ENV === "test";
  if (!isTestEnv) {
    meta ? console.log(message, meta) : console.log(message);
  }
};

export { log, extractObject };
