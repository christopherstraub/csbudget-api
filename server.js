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

import knex from './knex-instance.js';

const app = express();

app.use(express.json());
app.use(cors());

app.post('/sign-up', handleSignUp(knex, bcrypt));
app.post('/sign-in', handleSignIn(knex, bcrypt));
app.post('/budget', handleCreateBudget(knex));
app.post('/budget-copy', handleCreateBudgetCopy(knex));
app.delete('/budget', handleDeleteBudget(knex));
app.put('/budget', handleSaveBudget(knex));
app.put('/budgets', handleSaveBudgets(knex));
app.put('/current-budget-index', handleCurrentBudgetIndexUpdate(knex));
app.put('/display-name', handleDisplayNameChange(knex));
app.put('/password', handlePasswordChange(knex, bcrypt));
app.put('/currency', handleCurrencyChange(knex));

app.listen(process.env.PORT ?? 3001);
