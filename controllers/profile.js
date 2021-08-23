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
  res.send('Change password');
};

export { handleChangeDisplayName, handleChangePassword };
