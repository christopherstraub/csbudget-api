const handleSignIn = (database, bcrypt) => (req, res) => {
  const { username, password } = req.body;

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
    .then((result) =>
      result
        ? database('app_user')
            .where('username', username)
            .select(
              'id',
              'username',
              'display_name',
              'join_date',
              'current_budget_index'
            )
        : Promise.reject(Error())
    )
    .then((users) => res.json(users[0]))
    .catch((error) => res.sendStatus(400));
};

export default handleSignIn;
