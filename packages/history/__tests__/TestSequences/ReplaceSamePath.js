import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let prevLocation;

  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.replace('/home');
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      prevLocation = location;

      history.replace('/home');
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      expect(location).not.toBe(prevLocation);
    }
  ];

  execSteps(steps, history, done);
};
