export function extractFirstLetters(user) {
  return `${user.firstname?.[0] || ""}${
    user.lastname ? " " + user.lastname[0] : ""
  }`.trim();
}
