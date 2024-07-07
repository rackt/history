import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.replace('/home?the=query#the-hash');
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home',
        search: '?the=query',
        hash: '#the-hash',
        state: null,
        key: expect.any(String)
      });

      history.replace('/');
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/',
        search: '',
        state: null,
        key: expect.any(String)
      });
    }
  ];

  execSteps(steps, history, done);
};
