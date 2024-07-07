import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let hookWasCalled = false;
  let unblock;

  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      unblock = history.block(() => {
        hookWasCalled = true;
      });

      window.history.go(-1);
    },
    ({ action, location }) => {
      expect(action).toBe('POP');
      expect(location).toMatchObject({
        pathname: '/'
      });

      expect(hookWasCalled).toBe(true);

      unblock();
    }
  ];

  execSteps(steps, history, done);
};
