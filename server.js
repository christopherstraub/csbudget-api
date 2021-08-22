import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import handleSignUp from './controllers/signup.js';
import handleSignIn from './controllers/signin.js';
import {
  handleCreateBudget,
  handleSaveBudget,
  handleSaveBudgets,
} from './controllers/budget.js';
import {
  handleChangeDisplayName,
  handleChangePassword,
} from './controllers/profile.js';

import database from './database.js';

const app = express();
app.use(express.json());

app.post('/signup', handleSignUp(database, bcrypt));
app.post('/signin', handleSignIn(database, bcrypt));
app.post('/createbudget', handleCreateBudget(database));
app.put('/savebudget', handleSaveBudget(database));
app.put('/savebudgets', handleSaveBudgets(database));
app.put('/changedisplayname', handleChangeDisplayName(database));
app.put('/changepassword', handleChangePassword(database, bcrypt));

app.listen(3001);
