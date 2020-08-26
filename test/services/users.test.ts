import assert from 'assert';
import app from '../../src/app';

describe('\'Users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });
});
