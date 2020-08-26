// Transactions-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
import Knex from 'knex';
import { Application } from '../declarations';

export default function (app: Application): Knex {
  const db: Knex = app.get('knexClient');
  const tableName = 'transactions';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.increments('id');
        table.float('amount');
        table.string('currency');
        table.string('accountFrom').nullable();
        table.string('accountTo').nullable();
        table.foreign('accountFrom').references('Accounts.accountNumber');
        table.foreign('accountTo').references('Accounts.accountNumber');
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });
  

  return db;
}
