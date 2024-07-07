import mock from 'jest-mock';

export function spyOn(object, method) {
  let original = object[method];
  let spy = mock.fn();

  object[method] = spy;

  return {
    spy,
    destroy() {
      object[method] = original;
    }
  };
}

export function execSteps(steps, history, done) {
  let index = 0,
    unlisten,
    cleanedUp = false;

  function cleanup(...args) {
    if (!cleanedUp) {
      cleanedUp = true;
      unlisten();
      done(...args);
    }
  }

  function execNextStep(...args) {
    try {
      let nextStep = steps[index++];
      if (!nextStep) throw new Error('Test is missing step ' + index);

      nextStep(...args);

      if (index === steps.length) cleanup();
    } catch (error) {
      cleanup(error);
    }
  }

  if (steps.length) {
    unlisten = history.listen(execNextStep);

    execNextStep({
      action: history.action,
      location: history.location
    });
  } else {
    done();
  }
}
