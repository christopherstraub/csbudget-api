const handleCreateBudget = (database) => (req, res) => {
  const { app_user_id, name, entries } = req.body;

  database('budget')
    .insert({ app_user_id, name, entries }, [
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

const handleDeleteBudget = (database) => (req, res) => {
  const { app_user_id, id } = req.body;

  database('budget')
    .where('app_user_id', app_user_id)
    .andWhere('id', id)
    .del(['id'])
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
    last_saved,
    projected_monthly_income,
    actual_monthly_income,
    entries,
  } = req.body;

  database('budget')
    .where('app_user_id', app_user_id)
    .andWhere('id', id)
    .update(
      {
        name,
        last_saved,
        projected_monthly_income,
        actual_monthly_income,
        entries,
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
    .then((savedBudgets) =>
      savedBudgets.length ? res.json(savedBudgets[0]) : Promise.reject(Error())
    )
    .catch((error) => res.sendStatus(400));
};

const handleSaveBudgets = (database) => (req, res) => {
  const { app_user_id, budgets } = req.body;

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
          last_saved,
          projected_monthly_income,
          actual_monthly_income,
          entries,
        } = budget;

        return database('budget')
          .where('app_user_id', app_user_id)
          .andWhere('id', budget.id)
          .update(
            {
              name,
              last_saved,
              projected_monthly_income,
              actual_monthly_income,
              entries,
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

export {
  handleCreateBudget,
  handleDeleteBudget,
  handleSaveBudget,
  handleSaveBudgets,
};
