const handleChangeDisplayName = (database) => (req, res) => {
  const { id, display_name } = req.body;

  if (!Number.isInteger(id) || !display_name) return res.sendStatus(400);

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

  // Validation.
  if (
    !Number.isInteger(id) ||
    !password ||
    !new_password ||
    password.length < 8 ||
    password.length > 128 ||
    new_password.length < 8 ||
    new_password.length > 128 ||
    password === new_password
  )
    return res.sendStatus(400);

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
      isValid
        ? bcrypt.hash(new_password, 10)
        : Promise.reject(Error('Unauthorized'))
    )
    // Update database with new hash.
    .then((newHash) =>
      database('app_user')
        .where('id', id)
        .update({ hash: newHash })
        .then(() => res.sendStatus(200))
    )
    .catch((error) =>
      error.message === 'Unauthorized'
        ? res.sendStatus(401)
        : res.sendStatus(400)
    );
};

export { handleChangeDisplayName, handleChangePassword };
