const handleSignUp = (database, bcrypt) => (req, res) => {
  const { username, password, display_name } = req.body;

  // If a user with the incoming username already exists,
  // respond with a 409 Conflict status code.
  database('app_user')
    .where('username', username)
    .select()
    .then((users) =>
      users.length ? Promise.reject(Error('Conflict')) : Promise.resolve()
    )
    // Hash password.
    .then(() => bcrypt.hash(password, 10))
    // Enter user into database with hash.
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
    .catch((error) => {
      if (error.message === 'Conflict') res.sendStatus(409);
      else res.sendStatus(400);
    });
};

export default handleSignUp;
