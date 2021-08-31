export const timeoutPromise = <T>(fc: Promise<T>): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      console.log("Ran into fetch timeout");
      resolve(undefined);
    }, 5000);

    fc.then((res) => {
      clearTimeout(timer);
      resolve(res);
    }).catch((reason) => {
      clearTimeout(timer);
      reject(reason);
    });
  });
};
