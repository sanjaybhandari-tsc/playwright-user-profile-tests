function validateUsers(users) {
  const errors = [];

  users.forEach((user, index) => {
    if (!user.email) {
      errors.push(`Row ${index + 1}: Missing email`);
    }

    if (!user.password || String(user.password).length < 6) {
      errors.push(`Row ${index + 1}: Invalid password`);
    }
  });

  if (errors.length) {
    console.error(errors);
    throw new Error("Invalid Excel Data");
  }
}

module.exports = { validateUsers };