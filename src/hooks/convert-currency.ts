// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
import { Hook, HookContext } from '@feathersjs/feathers';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default (options = {}): Hook => {
  return async (context: HookContext): Promise<HookContext> => {
    const txnCurrency: string = context.data.currency;
    const txnAmount: number = context.data.amount;
    
    switch (txnCurrency) {
    case 'USD':
      context.data.amount = txnAmount * 2;
      break;
    case 'MXN':
      context.data.amount = txnAmount / 10;
      break;
    }
    
    delete context.data.currency;
    
    return context;
  };
};
