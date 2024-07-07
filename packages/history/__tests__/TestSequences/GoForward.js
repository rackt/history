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
      expect(action).toEqual('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      history.back();
    },
    ({ action, location }) => {
      expect(action).toEqual('POP');
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.forward();
    },
    ({ action, location }) => {
      expect(action).toEqual('POP');
      expect(location).toMatchObject({
        pathname: '/home'
      });
    }
  ];

  execSteps(steps, history, done);
};
