CREATE TABLE app_user (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(50) NOT NULL,
  current_budget_index SMALLINT NOT NULL DEFAULT 0,
  format_args JSON NOT NULL DEFAULT '{"locale":"en-US","currency":"USD"}',
  join_date TIMESTAMP NOT NULL,
  hash VARCHAR(60) NOT NULL
);

CREATE TABLE budget (
  app_user_id INT REFERENCES app_user,
  id SERIAL,
  name VARCHAR(50) NOT NULL,
  last_saved TIMESTAMP,
  projected_monthly_income NUMERIC(22,6) NOT NULL DEFAULT 0,
  actual_monthly_income NUMERIC(22,6) NOT NULL DEFAULT 0,
  entries_created BIGINT NOT NULL DEFAULT 5,
  entries JSON NOT NULL DEFAULT '[{"id":0,"category":"Housing costs","projectedCost":1000,"actualCost":0},{"id":1,"category":"Vehicle expenses","projectedCost":200,"actualCost":0},{"id":2,"category":"Phone bill","projectedCost":20,"actualCost":0},{"id":3,"category":"Groceries","projectedCost":250,"actualCost":0},{"id":4,"category":"Savings","projectedCost":100,"actualCost":0}]',
  PRIMARY KEY (id, app_user_id)
);