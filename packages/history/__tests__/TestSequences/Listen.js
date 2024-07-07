import expect from 'expect';
import mock from 'jest-mock';

export default (history, done) => {
  let spy = mock.fn();
  let unlisten = history.listen(spy);

  expect(spy).not.toHaveBeenCalled();

  unlisten();
  done();
};
