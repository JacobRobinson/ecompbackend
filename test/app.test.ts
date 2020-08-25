import assert from 'assert';
import { Server } from 'http';
import url from 'url';
import axios from 'axios';

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
        const stewiesDeposit = await axios.post(getUrl('transactions'), {
          headers: {
            'Accept': 'text/html'
          }
        });
        // assert.equal(stewiesDeposit.finalBalance, 400)
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 2: Glenn Quagmire throws a party', async () => {
      try {
        await axios.post(getUrl('transactions'), {
        });
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 3: Joe Swanson takes a bribe from Joe Shark', async () => {
      try {
        await axios.post(getUrl('transactions'), {
        });
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 4: Lois gives Peter his allowance', async () => {
      try {
        await axios.post(getUrl('transactions'), {
        });
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 5: Joe Shark tries to get his money back from Joe Swanson', async () => {
      try {
        await axios.post(getUrl('transactions'), {
        });
      } catch (error) {
        assert.fail('Should not throw');
      }
    });

    it('Case 6: Peter and Lois sell Meg to Joe Shark', async () => {
      try {
        await axios.post(getUrl('transactions'), {
        });
      } catch (error) {
        assert.fail('Should not throw');
      }
    });


    it('Case ', async () => {
      try {
        await axios.post(getUrl('transactions'), {
          headers: {
            'Accept': 'text/html'
          }
        });
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
