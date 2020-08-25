// Initializes the `Transactions` service on path `/transactions`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Transactions } from './transactions.class';
import hooks from './transactions.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'transactions': Transactions & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/transactions', new Transactions(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('transactions');

  service.hooks(hooks);
}
