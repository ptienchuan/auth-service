const extractObject = <T, K extends keyof T>(
  object: T,
  properties: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  properties.forEach((property) => {
    if (property in object) {
      result[property] = object[property];
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

export { extractObject, log };
