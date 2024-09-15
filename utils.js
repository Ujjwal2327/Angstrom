export function extractFirstLetters(user) {
  return `${user.firstname?.[0] || ""}${
    user.lastname ? " " + user.lastname[0] : ""
  }`.trim();
}

export function handleActionError(errorMessage, throwable, returnValue) {
  if (throwable) throw new Error(errorMessage);
  else {
    console.error(errorMessage);
    return returnValue;
  }
}

export function handleCaughtActionError(
  errorMessageStart,
  errorMessage,
  throwable,
  returnValue
) {
  errorMessage = errorMessage
    ? `${errorMessageStart}: ${errorMessage}`
    : errorMessageStart;
  console.error(errorMessage);
  if (throwable) throw new Error(errorMessage);
  else return returnValue;
}
