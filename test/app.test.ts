import assert from 'assert';
import { Server } from 'http';
import url from 'url';
import axios, { AxiosResponse } from 'axios';

import app from '../src/app';

const port = app.get('port') || 8998;
const getUrl = (pathname?: string): string => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname
});

describe('Feathers application tests', () => {
  let server: Server;

  before(function(done) {
    server = app.listen(port);
    server.once('listening', () => done());
  });

  after(function(done) {
    server.close(done);
  });

  it('starts and shows the index page', async () => {
    const { data } = await axios.get(getUrl());

    assert.ok(data.indexOf('<html lang="en">') !== -1);
  });

  describe('End to End Testing', function() {
    // These test cases correspond to the five cases provided 
    // in the coding assignment as well as a sixth case to 
    // cover the situation where two people share a joint 
    // account
    it('Case 1: Stewie Griffin makes a deposit', async () => {
      try {
        // initialize
        await axios.post(getUrl('transactions'), {
          customerID: '777',
          accountFrom: '2001',
          amount: 100,
          currency: 'CAD'
        });

        const stewiesDeposit = await axios.post(getUrl('transactions'),{
          customerID: '777',
          accountFrom: '1234',
          amount: 300,
          currency: 'USD'
        });

        assert.strictEqual(stewiesDeposit.data.balance, 700);
        assert.strictEqual(stewiesDeposit.data.accountFrom, 1234);
        assert.strictEqual(stewiesDeposit.data.amount, 600);
      } catch (error) {
        console.error(error.config);
        console.error('=================');
        console.error(error.response.data);
        assert.fail('Should not throw: ' + error.code);
      }
    });

    it('Case 2: Glenn Quagmire throws a party', async () => {
      try {
        // initialize
        await axios.post(getUrl('transactions'), {
          customerID: '504',
          accountFrom: '2001',
          amount: 35000,
          currency: 'CAD'
        });

        const glennsParty: AxiosResponse[] = [];
        
        glennsParty.push(await axios.post(getUrl('transactions'), {
          customerID: '504',
          accountFrom: '2001',
          amount: -5000,
          currency: 'MXN'
        }));

        glennsParty.push(await axios.post(getUrl('transactions'), {
          customerID: '504',
          accountFrom: '2001',
          amount: -12500,
          currency: 'USD'
        }));

        glennsParty.push(await axios.post(getUrl('transactions'), {
          customerID: '504',
          accountFrom: '2001',
          amount: 300,
          currency: 'CAD'
        }));

        const finalBalance = glennsParty[glennsParty.length - 1].data.balance;

        assert.strictEqual(finalBalance, 35000 - 500 - 25000 + 300);
        assert.strictEqual(finalBalance, 9800);
        assert.strictEqual(glennsParty[0].data.amount, -5000 / 10);
        assert.strictEqual(glennsParty[1].data.amount, -12500 * 2);
        assert.strictEqual(glennsParty[2].data.amount, 300);
      } catch (error) {
        assert.fail('Should not throw: ' + error.code);
      }
    });

    it('Case 3: Joe Swanson takes a bribe from John Shark', async () => {
      try {
        // initialize
        await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '1010',
          amount: 7425,
          currency: 'CAD'
        });

        await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '5500',
          amount: 15000,
          currency: 'CAD'
        });

        const innocuousWithdrawal = await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '5500',
          amount: -5000,
          currency: 'CAD'
        });

        const layering = await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '1010',
          amount: 7300,
          accountTo: '5500',
          currency: 'CAD'
        });

        const theBigOne = await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '1010',
          amount: 13726,
          currency: 'MXN'
        });

        assert.strictEqual(innocuousWithdrawal.data.accountFrom, 5500);
        assert.strictEqual(innocuousWithdrawal.data.balance, 15000 - 5000);
        assert.strictEqual(innocuousWithdrawal.data.amount, -5000);
        assert.strictEqual(layering.data.accountFrom, 1010);
        assert.strictEqual(layering.data.balance, 7425 - 7300);
        assert.strictEqual(layering.data.amount, 7300);
        assert.strictEqual(layering.data.accountTo, 5500);
        assert.strictEqual(theBigOne.data.accountFrom, 5500);
        assert.strictEqual(theBigOne.data.balance, 15000 - 5000 + 7300 + 13726 / 10);
        assert.strictEqual(theBigOne.data.balance, 1497.60);

      } catch (error) {
        assert.fail('Should not throw: ' + error.code);
      }
    });

    it('Case 4: Lois gives Peter his allowance', async () => {
      try {
        // initialize Peter's account
        await axios.post(getUrl('transactions'), {
          customerID: '123',
          accountFrom: '0123',
          amount: 150,
          currency: 'CAD'
        });

        // initialize Lois' account
        await axios.post(getUrl('transactions'), {
          customerID: '456',
          accountFrom: '0456',
          amount: 65000,
          currency: 'CAD'
        });

        const petersWithdrawal = await axios.post(getUrl('transactions'), {
          customerID: '123',
          accountFrom: '0123',
          amount: -70,
          currency: 'USD'
        });

        const loisDeposit = await axios.post(getUrl('transactions'), {
          customerID: '456',
          accountFrom: '0456',
          amount: 23789,
          currency: 'CAD'
        });

        const petersAllowance = await axios.post(getUrl('transactions'), {
          customerID: '456',
          accountFrom: '0456',
          amount: 23.75,
          accountTo: '0123',
          currency: 'CAD'
        });

        const peterChecksHisAllowance = await axios.get(getUrl('accounts'), {
          params: {
            customerID: '123',
            account: '0123'
          }
        });

        assert.strictEqual(peterChecksHisAllowance.data.balance, 150 - 70*2 + 23.75);
        assert.strictEqual(petersAllowance.data.balance, 65000 + 23789 - 23.75);
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 5: John Shark tries to get his money back from Joe Swanson', async () => {
      let johnsAttempt;
      try {
        // initialize
        await axios.post(getUrl('transactions'), {
          customerID: '002',
          accountFrom: '1010',
          amount: 7425,
          currency: 'CAD'
        });

        johnsAttempt = await axios.post(getUrl('transactions'), {
          customerID: '219',
          accountFrom: '1010',
          amount: -100,
          currency: 'CAD'
        });

        assert.fail('John\'s attempt should have failed');
      } catch (error) {
        // console.error(error);
        assert.equal(johnsAttempt.data, 'this needs to be updated');
        // TODO: figure out what error to throw, or if it should throw one at all
        assert.fail('not sure how to pass this test yet. figure it out');
      }
    });

    it('Case 6: Peter and Lois pay John Shark to take Meg from their joint account', async () => {
      try {
        // initialize 
        await axios.post(getUrl('transactions'), {
          customerID: '456',
          accountFrom: '0789',
          amount: 20000,
          currency: 'CAD'
        });

        const pleaseJustTakeHer = await axios.post(getUrl('transactions'), {
          customerID: '456',
          accountFrom: '0789',
          amount: 5000,
          accountTo: '0212',
          currency: 'CAD'
        });
        
        assert.strictEqual(pleaseJustTakeHer.data.balance, 20000 - 5000);
        assert.strictEqual(pleaseJustTakeHer.data.amount, 5000);
        assert.strictEqual(pleaseJustTakeHer.data.accountTo, '0212');
        assert.strictEqual(pleaseJustTakeHer.data.accountFrom, '0789');
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('shows a 404 HTML page', async () => {
      try {
        await axios.get(getUrl('path/to/nowhere'), {
          headers: {
            'Accept': 'text/html'
          }
        });
        assert.fail('should never get here');
      } catch (error) {
        const { response } = error;

        assert.equal(response.status, 404);
        assert.ok(response.data.indexOf('<html>') !== -1);
      }
    });
  });
});
