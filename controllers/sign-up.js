const handleSignUp = (database, bcrypt) => (req, res) => {
  const { display_name, username, password } = req.body;

  // Validation.
  if (
    !display_name ||
    !username ||
    !password ||
    password.length < 8 ||
    password.length > 128
  )
    return res.sendStatus(400);

  /* If a user with the incoming username already exists,
  respond with a 409 Conflict status code. */
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
      /* Return a transaction since both the user sign up and create budget
    queries should be successful to continue. */
      database.transaction((trx) =>
        // Insert user, returning their id.
        database('app_user')
          .insert(
            {
              username,
              display_name,
              hash,
              join_date: new Date(),
            },
            ['id']
          )
          .transacting(trx)
          .then((ids) => ids[0].id)
          /* Create a budget for the user, returning the user's id
          to respond with the user. */
          .then((id) =>
            database('budget')
              .insert(
                {
                  app_user_id: id,
                  name: new Date().toLocaleDateString([], {
                    month: 'long',
                    year: 'numeric',
                  }),
                },
                ['app_user_id']
              )
              .transacting(trx)
          )
      )
    )
    .then((ids) => ids[0].app_user_id)
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
          ),
      ])
    )
    // Extract a nice user object from the data.
    .then((data) => ({ ...data[0][0], budgets: data[1] }))
    .then((user) => res.json(user))
    .catch((error) =>
      error.message === 'Conflict' ? res.sendStatus(409) : res.sendStatus(400)
    );
};

export default handleSignUp;
