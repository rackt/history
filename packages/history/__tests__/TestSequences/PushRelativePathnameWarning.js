import expect from 'expect';

import { execSteps, spyOn } from './utils.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/the/path?the=query#the-hash');
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      let { spy, destroy } = spyOn(console, 'warn');

      history.push('../other/path?another=query#another-hash');

      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining('relative pathnames are not supported')
      );

      destroy();
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '../other/path',
        search: '?another=query',
        hash: '#another-hash'
      });
    }
  ];

  execSteps(steps, history, done);
};
