const handleChangeDisplayName = (database) => (req, res) => {
  const { id, display_name } = req.body;

  database('app_user')
    .where('id', id)
    .update({ display_name }, ['display_name'])
    .then((displayNames) =>
      displayNames.length ? res.json(displayNames[0]) : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

const handleChangePassword = (database, bcrypt) => (req, res) => {
  const { id, password, new_password } = req.body;

  // If incoming current and new passwords are the same,
  // respond with a 400 Bad Request status code.
  if (password === new_password) res.sendStatus(400);
  else {
    // Get the user's current hash.
    database('app_user')
      .where('id', id)
      .select('hash')
      .then((hashes) =>
        hashes.length ? hashes[0].hash : Promise.reject(Error())
      )
      // Compare incoming password to hash.
      .then((hash) => bcrypt.compare(password, hash))
      // If valid, hash the new password and return hash.
      .then((isValid) =>
        isValid ? bcrypt.hash(new_password, 10) : Promise.reject(Error())
      )
      // Update database with new hash.
      .then((newHash) =>
        database('app_user')
          .where('id', id)
          .update({ hash: newHash })
          .then(() => res.sendStatus(200))
      )
      .catch((error) => res.sendStatus(400));
  }
};

export { handleChangeDisplayName, handleChangePassword };
