import express from 'express';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';

import handleSignUp from './controllers/signup.js';
import handleSignIn from './controllers/signin.js';
import handleCreateBudget from './controllers/createbudget.js';
import handleSaveBudget from './controllers/savebudget.js';
import handleSaveBudgets from './controllers/savebudgets.js';
import HandleChangeDisplayName from './controllers/changedisplayname.js';

const app = express();

app.post('/signup', handleSignUp);
app.post('/signin', handleSignIn);
app.post('/createbudget', handleCreateBudget);
app.put('/savebudget', handleSaveBudget);
app.put('/savebudgets', handleSaveBudgets);
app.put('/changedisplayname', HandleChangeDisplayName);

app.listen(3001);
