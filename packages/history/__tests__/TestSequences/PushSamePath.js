import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
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

      history.push('/home');
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      history.back();
    },
    ({ action, location }) => {
      expect(action).toBe('POP');
      expect(location).toMatchObject({
        pathname: '/home'
      });
    }
  ];

  execSteps(steps, history, done);
};
