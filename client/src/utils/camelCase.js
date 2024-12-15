export const toCamelCase = (name) => {
  return name
    .toLowerCase() // Ensure all letters are lowercase
    .split(" ") // Split by spaces
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
    .join(" "); // Join back the words with spaces
};
