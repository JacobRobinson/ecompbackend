// Accounts-model.js - A KnexJS
// 
// See http://knexjs.org/
// for more of what you can do here.
import Knex from 'knex';
import { Application } from '../declarations';

export default function (app: Application): Knex {
  const db: Knex = app.get('knexClient');
  const tableName = 'accounts';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.increments('id');
        table.float('balance');
        table.string('accountNumber').notNullable().index();
        table.string('primary').notNullable().index();
        table.string('secondary').nullable();
        table.foreign('secondary').references('Users.customerID');
        table.foreign('primary').references('Users.customerID');
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });
  

  return db;
}
