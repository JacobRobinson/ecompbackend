// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext, Paginated, Id } from '@feathersjs/feathers';
import { Accounts } from '../services/accounts/accounts.class';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const as: Accounts = context.app.services.accounts;
    const accountFrom = context.data.accountFrom;
    const accountTo = context.data.accountTo;
    const amount = context.result.amount;
    
    if (accountTo) {
      const updatedBalance = await Promise.all([
        updateAccountBalance(accountTo, amount, as),
        updateAccountBalance(accountFrom, -amount, as)
      ]);
      context.result.balance = updatedBalance[1];
    }
    else
    {
      const updatedBalance = await updateAccountBalance(accountFrom, amount, as);
      context.result.balance = updatedBalance;
    }
    
    return context;
  };
};

async function updateAccountBalance(accountNumber: number, txnAmount: number, accountsService: Accounts): Promise<number> {
  const account: Paginated<any> = <Paginated<any>> await accountsService.find({query: { accountNumber }});
  const oldBalance: number = account.data[0].balance;
  const accountID: Id = account.data[0].id;
  const newBalance: number = oldBalance + txnAmount;
  await accountsService.patch(accountID, {balance: newBalance});

  return newBalance;
}