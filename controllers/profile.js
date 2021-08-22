const handleChangeDisplayName = (database) => (req, res) => {
  res.send('Change display name');
};

const handleChangePassword = (database, bcrypt) => (req, res) => {
  res.send('Change password');
};

export { handleChangeDisplayName, handleChangePassword };
