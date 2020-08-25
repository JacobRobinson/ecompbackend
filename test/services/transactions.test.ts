import assert from 'assert';
import app from '../../src/app';

describe('\'Transactions\' service', () => {
  it('registered the service', () => {
    const service = app.service('transactions');

    assert.ok(service, 'Registered the service');
  });
});
