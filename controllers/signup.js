const handleSignUp = (database, bcrypt) => (req, res) => {
  database.select().from('app_user').then(console.log).catch(console.log);
  res.json('Sign up');
};

export default handleSignUp;
