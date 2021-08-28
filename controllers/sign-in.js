const handleSignIn = (database, bcrypt) => (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password || password.length < 8 || password.length > 128)
    return res.sendStatus(400);

  // Get the user's current hash.
  database('app_user')
    .where('username', username)
    .select('hash')
    .then((hashes) =>
      hashes.length ? hashes[0].hash : Promise.reject(Error())
    )
    // Compare incoming password to hash.
    .then((hash) => bcrypt.compare(password, hash))
    // If valid, return user.
    .then((isValid) =>
      isValid
        ? database('app_user').where('username', username).select('id')
        : Promise.reject(Error())
    )
    .then((ids) => ids[0].id)
    // Make two different queries, one returning the user,
    // and other returning their budgets.
    .then((id) =>
      Promise.all([
        database('app_user')
          .where('id', id)
          .select(
            'id',
            'username',
            'display_name',
            'join_date',
            'current_budget_index'
          ),
        database('budget')
          .where('app_user_id', id)
          .select(
            'id',
            'name',
            'last_saved',
            'projected_monthly_income',
            'actual_monthly_income',
            'entries_created',
            'entries'
          )
          .orderBy('id'),
      ])
    )
    // Extract a nice user object from the data.
    .then((data) => ({ ...data[0][0], budgets: data[1] }))
    .then((user) => res.json(user))
    .catch((error) => res.sendStatus(400));
};

export default handleSignIn;
