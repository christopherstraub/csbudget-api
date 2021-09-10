const handleDisplayNameChange = (knex) => (req, res) => {
  const { id, display_name } = req.body;

  // Validation.
  if (!Number.isInteger(id) || !display_name) return res.sendStatus(400);

  knex('app_user')
    .where({ id })
    .update({ display_name }, ['display_name'])
    .then((displayNames) =>
      displayNames.length ? res.json(displayNames[0]) : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

const handlePasswordChange = (knex, bcrypt) => (req, res) => {
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
  knex('app_user')
    .where({ id })
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
      knex('app_user')
        .where({ id })
        .update({ hash: newHash })
        .then(() => res.sendStatus(200))
    )
    .catch((error) =>
      error.message === 'Unauthorized'
        ? res.sendStatus(401)
        : res.sendStatus(400)
    );
};

const handleCurrencyChange = (knex) => (req, res) => {
  const { id, format_args } = req.body;

  if (!Number.isInteger(id) || !format_args) return res.sendStatus(400);

  knex('app_user')
    .where({ id })
    .update({ format_args: JSON.stringify(format_args) }, ['format_args'])
    .then((formatArgs) =>
      formatArgs.length ? res.json(formatArgs[0]) : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

export { handleDisplayNameChange, handlePasswordChange, handleCurrencyChange };
