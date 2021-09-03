const handleCreateBudget = (database) => (req, res) => {
  const { app_user_id, name } = req.body;

  // Validation.
  if (!Number.isInteger(app_user_id) || !name) return res.sendStatus(400);

  database('budget')
    .insert({ app_user_id, name }, [
      'id',
      'name',
      'last_saved',
      'projected_monthly_income',
      'actual_monthly_income',
      'entries_created',
      'entries',
    ])
    .then((budgets) => res.json(budgets[0]))
    .catch((error) => res.sendStatus(400));
};

const handleCreateBudgetCopy = (database) => (req, res) => {
  const {
    app_user_id,
    name,
    projected_monthly_income,
    actual_monthly_income,
    entries_created,
    entries,
  } = req.body;

  // Validation.
  if (
    !Number.isInteger(app_user_id) ||
    !name ||
    isNaN(projected_monthly_income) ||
    isNaN(actual_monthly_income) ||
    !Number.isInteger(entries_created) ||
    !entries
  )
    return res.sendStatus(400);

  database('budget')
    .insert(
      {
        app_user_id,
        name,
        projected_monthly_income,
        actual_monthly_income,
        entries_created,
        entries: JSON.stringify(entries),
      },
      [
        'id',
        'name',
        'last_saved',
        'projected_monthly_income',
        'actual_monthly_income',
        'entries_created',
        'entries',
      ]
    )
    .then((budgets) => res.json(budgets[0]))
    .catch((error) => res.sendStatus(400));
};

const handleDeleteBudget = (database) => (req, res) => {
  const { app_user_id, id, current_budget_index } = req.body;

  const currentBudgetIndexNotValid = (currentBudgetIndex) =>
    !Number.isInteger(currentBudgetIndex) ||
    currentBudgetIndex < 0 ||
    currentBudgetIndex > 99;

  // Validation.
  if (
    !Number.isInteger(app_user_id) ||
    !Number.isInteger(id) ||
    currentBudgetIndexNotValid(current_budget_index)
  )
    return res.sendStatus(400);

  database
    .transaction((trx) =>
      database('app_user')
        .where({ id: app_user_id })
        .update({ current_budget_index }, ['id'])
        .transacting(trx)
        .then((ids) => ids[0].id)
        .then((app_user_id) =>
          database('budget')
            .where({ app_user_id })
            .andWhere({ id })
            .del(['id'])
            .transacting(trx)
        )
    )
    .then((deletedBudgetIds) =>
      deletedBudgetIds.length
        ? res.json(deletedBudgetIds[0])
        : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

const handleSaveBudget = (database) => (req, res) => {
  const {
    app_user_id,
    id,
    name,
    projected_monthly_income,
    actual_monthly_income,
    entries_created,
    entries,
  } = req.body;

  // Validation.
  if (
    !Number.isInteger(app_user_id) ||
    !Number.isInteger(id) ||
    !name ||
    isNaN(projected_monthly_income) ||
    isNaN(actual_monthly_income) ||
    !Number.isInteger(entries_created) ||
    !entries
  )
    return res.sendStatus(400);

  database('budget')
    .where({ app_user_id })
    .andWhere({ id })
    .update(
      {
        name,
        last_saved: new Date(),
        projected_monthly_income,
        actual_monthly_income,
        entries_created,
        entries: JSON.stringify(entries),
      },
      ['id', 'last_saved']
    )
    .then((savedBudgets) =>
      savedBudgets.length ? res.json(savedBudgets[0]) : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

const handleSaveBudgets = (database) => (req, res) => {
  const { app_user_id, budgets } = req.body;

  // Validation.
  if (!Number.isInteger(app_user_id) || !budgets) return res.sendStatus(400);

  /*
  Map each budget to a query (promise). Chain the transacting
  method to the queries with the transaction object to join them
  as part of the transaction.
  */
  database
    .transaction((trx) => {
      const queries = budgets.map((budget) => {
        const {
          name,
          projectedMonthlyIncome: projected_monthly_income,
          actualMonthlyIncome: actual_monthly_income,
          entriesCreated: entries_created,
          entries,
        } = budget;

        return database('budget')
          .where({ app_user_id })
          .andWhere({ id: budget.id })
          .update(
            {
              name,
              last_saved: new Date(),
              projected_monthly_income,
              actual_monthly_income,
              entries_created,
              entries: JSON.stringify(entries),
            },
            [
              'id',
              'name',
              'last_saved',
              'projected_monthly_income',
              'actual_monthly_income',
              'entries_created',
              'entries',
            ]
          )
          .transacting(trx)
          .then((savedBudgets) =>
            savedBudgets.length ? savedBudgets[0] : Promise.reject(Error())
          );
      });

      /*
      Returning a promise to the transaction handler function will
      automatically commit the transaction upon promise resolution or
      automatically rollback the transaction upon promise rejection.
      We want to ensure all the queries resolve before committing the
      transaction, thus we return the below promise to the transaction
      handler function.
      */
      return Promise.all(queries);
    })
    .then((savedBudgets) => res.json(savedBudgets))
    .catch((error) => res.sendStatus(400));
};

const handleCurrentBudgetIndexUpdate = (database) => (req, res) => {
  const { id, current_budget_index } = req.body;

  const currentBudgetIndexNotValid = (currentBudgetIndex) =>
    !Number.isInteger(currentBudgetIndex) ||
    currentBudgetIndex < 0 ||
    currentBudgetIndex > 99;

  // Validation.
  if (!Number.isInteger(id) || currentBudgetIndexNotValid(current_budget_index))
    return res.sendStatus(400);

  // Save user's current budget index.
  database('app_user')
    .where({ id })
    .update({ current_budget_index })
    .then(() => res.sendStatus(200))
    .catch((error) => res.sendStatus(400));
};

export {
  handleCreateBudget,
  handleCreateBudgetCopy,
  handleDeleteBudget,
  handleSaveBudget,
  handleSaveBudgets,
  handleCurrentBudgetIndexUpdate,
};
