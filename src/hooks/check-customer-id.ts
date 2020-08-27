// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Service, Params } from '@feathersjs/feathers';
import { Accounts } from '../services/accounts/accounts.class';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const accountsService: Accounts = context.app.services.accounts;
    const requestCustomerID: number = context.data.customerID;
    const findParams: Params = {
      query: {
        primary: requestCustomerID
      }
    };
    const accountCheck = await accountsService.find(findParams);
    // console.log(accountCheck);
    // if (accountCheck != requestCustomerID) {
    //   throw new Error('Transaction denied: Wrong customer ID');
    // }

    delete context.data.customerID;

    return context;
  };
};
