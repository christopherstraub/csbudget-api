const handleSignOut = (database) => (req, res) => {
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

export default handleSignOut;
