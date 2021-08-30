import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import handleSignUp from './controllers/sign-up.js';
import handleSignIn from './controllers/sign-in.js';
import handleSignOut from './controllers/sign-out.js';
import {
  handleCreateBudget,
  handleCreateBudgetCopy,
  handleDeleteBudget,
  handleSaveBudget,
  handleSaveBudgets,
} from './controllers/budget.js';
import {
  handleDisplayNameChange,
  handlePasswordChange,
  handleCurrencyChange,
} from './controllers/profile.js';

import database from './database.js';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/sign-up', handleSignUp(database, bcrypt));
app.post('/sign-in', handleSignIn(database, bcrypt));
app.put('/sign-out', handleSignOut(database));
app.post('/budget', handleCreateBudget(database));
app.post('/budget-copy', handleCreateBudgetCopy(database));
app.delete('/budget', handleDeleteBudget(database));
app.put('/budget', handleSaveBudget(database));
app.put('/budgets', handleSaveBudgets(database));
app.put('/display-name', handleDisplayNameChange(database));
app.put('/password', handlePasswordChange(database, bcrypt));
app.put('/currency', handleCurrencyChange(database));

app.listen(process.env.PORT);
