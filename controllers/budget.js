const handleCreateBudget = (database) => (req, res) => {
  res.send('Create budget');
};

const handleSaveBudget = (database) => (req, res) => {
  res.send('Save budget');
};

const handleSaveBudgets = (database) => (req, res) => {
  res.send('Save budgets');
};

export { handleCreateBudget, handleSaveBudget, handleSaveBudgets };
