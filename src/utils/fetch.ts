export const timeoutPromise = <T>(fc: Promise<T>): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      resolve(undefined);
    }, 1000);

    fc.then((res) => {
      clearTimeout(timer);
      resolve(res);
    }).catch((reason) => {
      clearTimeout(timer);
      reject(reason);
    });
  });
};
