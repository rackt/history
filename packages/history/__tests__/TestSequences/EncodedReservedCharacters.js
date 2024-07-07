import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let steps = [
    () => {
      // encoded string
      let pathname = '/view/%23abc';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc'
      });
      // encoded object
      let pathname = '/view/%23abc';
      history.replace({ pathname });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc'
      });
      // unencoded string
      let pathname = '/view/#abc';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/',
        hash: '#abc'
      });
    }
  ];

  execSteps(steps, history, done);
};
