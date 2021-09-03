import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';

import handleSignUp from './controllers/sign-up.js';
import handleSignIn from './controllers/sign-in.js';
import {
  handleCreateBudget,
  handleCreateBudgetCopy,
  handleDeleteBudget,
  handleSaveBudget,
  handleSaveBudgets,
  handleCurrentBudgetIndexUpdate,
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
app.post('/budget', handleCreateBudget(database));
app.post('/budget-copy', handleCreateBudgetCopy(database));
app.delete('/budget', handleDeleteBudget(database));
app.put('/budget', handleSaveBudget(database));
app.put('/budgets', handleSaveBudgets(database));
app.put('/current-budget-index', handleCurrentBudgetIndexUpdate(database));
app.put('/display-name', handleDisplayNameChange(database));
app.put('/password', handlePasswordChange(database, bcrypt));
app.put('/currency', handleCurrencyChange(database));

app.listen(process.env.PORT ?? 3001);
