// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Paginated } from '@feathersjs/feathers';
import { Accounts } from '../services/accounts/accounts.class';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const accountsService: Accounts = context.app.services.accounts;
    const requestCustomerID: number = context.data.customerID;
    const requestAccountNumber: string = context.data.accountFrom;
    
    const accounts: Paginated<any> = <Paginated<any>> await accountsService.find({query: {primary: requestCustomerID}});
    const secondaryAccounts: Paginated<any> = <Paginated<any>> await accountsService.find({query: {secondary: requestCustomerID}});
    
    const accountNumbers: string[] = accounts.data.map((account: any) => account.accountNumber);
    const secondaryAccountNumbers: string[] = secondaryAccounts.data.map((account: any) => account.accountNumber);

    if (!accountNumbers.includes(requestAccountNumber) && !secondaryAccountNumbers.includes(requestAccountNumber)) {
      throw new Error('Transaction denied: wrong customer');
    }

    delete context.data.customerID;

    return context;
  };
};
