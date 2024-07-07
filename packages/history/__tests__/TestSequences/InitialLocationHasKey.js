import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location.key).toBeTruthy();
    }
  ];

  execSteps(steps, history, done);
};
