// Create a variable length random string
const unguessableRandomString = (outputLength: number) => {
  const stringPool =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Array.from() creates an array from an iterable object
  // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
  const randomString = Array.from(
    { length: outputLength },
    () => stringPool[Math.floor(Math.random() * stringPool.length)]
  ).join("");
  return randomString;
};

export default unguessableRandomString;
