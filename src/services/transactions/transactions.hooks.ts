
import checkCustomerId from '../../hooks/check-customer-id';
import convertCurrency from '../../hooks/convert-currency';
import updateBalances from '../../hooks/update-balances';
export default {
  before: {
    all: [checkCustomerId()],
    find: [],
    get: [],
    create: [convertCurrency()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [updateBalances()],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
