const handleChangeDisplayName = (database) => (req, res) => {
  const { id, display_name } = req.body;

  database('app_user')
    .where('id', id)
    .update({ display_name }, ['display_name'])
    .then((displayNames) =>
      displayNames.length ? res.json(displayNames[0]) : res.sendStatus(404)
    )
    .catch((error) => res.sendStatus(400));
};

const handleChangePassword = (database, bcrypt) => (req, res) => {
  const { id, password, new_password } = req.body;

  if (password === new_password) res.sendStatus(400);
  else {
    database('app_user')
      .where('id', id)
      .select('hash')
      .then((hashes) =>
        hashes.length ? hashes[0].hash : Promise.reject(Error())
      )
      .then((hash) => bcrypt.compare(password, hash))
      .then((result) =>
        result ? bcrypt.hash(new_password, 10) : Promise.reject(Error())
      )
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
