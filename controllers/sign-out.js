const handleSignOut = (database) => (req, res) => {
  const { id, current_budget_index } = req.body;

  // Save user's current budget index.
  database('app_user')
    .where('id', id)
    .update({ current_budget_index })
    .then(() => res.sendStatus(200))
    .catch((error) => res.sendStatus(400));
};

export default handleSignOut;
