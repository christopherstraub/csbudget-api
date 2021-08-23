const handleSignUp = (database, bcrypt) => (req, res) => {
  const { username, password, display_name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      database('app_user').insert(
        {
          username,
          hash,
          display_name,
          join_date: new Date(),
        },
        ['id', 'username', 'display_name', 'join_date', 'current_budget_index']
      )
    )
    .then((users) => res.json(users[0]))
    .catch((error) => res.sendStatus(400));
};

export default handleSignUp;
