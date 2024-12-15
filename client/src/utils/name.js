export function formatName(user) {
  if (!user || !user.firstName) {
    return ""; // Return an empty string if user or firstName is invalid
  }

  const fname =
    user.firstName.charAt(0).toUpperCase() +
    user.firstName.slice(1).toLowerCase();

  const lname = user.lastName
    ? user.lastName.charAt(0).toUpperCase() +
      user.lastName.slice(1).toLowerCase()
    : ""; // Handle missing or undefined lastName

  return `${fname} ${lname}`.trim(); // Trim to remove extra spaces if lname is empty
}
