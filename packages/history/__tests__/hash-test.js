import expect from "expect";
import { createHashHistory, createPath } from "history";

import Listen from "./TestSequences/Listen.js";
import InitialLocationDefaultKey from "./TestSequences/InitialLocationDefaultKey.js";
import PushNewLocation from "./TestSequences/PushNewLocation.js";
import PushSamePath from "./TestSequences/PushSamePath.js";
import PushState from "./TestSequences/PushState.js";
import PushMissingPathname from "./TestSequences/PushMissingPathname.js";
import PushRelativePathnameWarning from "./TestSequences/PushRelativePathnameWarning.js";
import ReplaceNewLocation from "./TestSequences/ReplaceNewLocation.js";
import ReplaceSamePath from "./TestSequences/ReplaceSamePath.js";
import ReplaceState from "./TestSequences/ReplaceState.js";
import EncodedReservedCharacters from "./TestSequences/EncodedReservedCharacters.js";
import GoBack from "./TestSequences/GoBack.js";
import GoForward from "./TestSequences/GoForward.js";
import BlockEverything from "./TestSequences/BlockEverything.js";
import BlockPopWithoutListening from "./TestSequences/BlockPopWithoutListening.js";

// TODO: Do we still need this?
// const canGoWithoutReload = window.navigator.userAgent.indexOf('Firefox') === -1;
// const describeGo = canGoWithoutReload ? describe : describe.skip;

export const testHashHistory = (initialRoot, options) => {
  let history;
  beforeEach(() => {
    window.history.replaceState(null, null, initialRoot);
    history = createHashHistory(options);
  });
  afterEach(() => {
    // Test window location at every step
    const { hashRoot = "/" } = options || {};
    const historyHref = createPath(history.location);
    const windowHref = window.location.hash.substr(1);
    expect(historyHref.replace(/^\//, hashRoot)).toEqual(windowHref);
  })

  it("knows how to create hrefs from location objects", () => {
    const href = history.createHref({
      pathname: "/the/path",
      search: "?the=query",
      hash: "#the-hash",
    });

    expect(href).toEqual("#/the/path?the=query#the-hash");
  });

  it("knows how to create hrefs from strings", () => {
    const href = history.createHref("/the/path?the=query#the-hash");
    expect(href).toEqual("#/the/path?the=query#the-hash");
  });

  it("does not encode the generated path", () => {
    const encodedHref = history.createHref({
      pathname: "/%23abc",
    });
    expect(encodedHref).toEqual("#/%23abc");

    const unencodedHref = history.createHref({
      pathname: "/#abc",
    });
    expect(unencodedHref).toEqual("#/#abc");
  });

  describe("listen", () => {
    it("does not immediately call listeners", (done) => {
      Listen(history, done);
    });
  });

  describe("the initial location", () => {
    it('has the "default" key', (done) => {
      InitialLocationDefaultKey(history, done);
    });
  });

  describe("push a new path", () => {
    it("calls change listeners with the new location", (done) => {
      PushNewLocation(history, done);
    });
  });

  describe("push the same path", () => {
    it("calls change listeners with the new location", (done) => {
      PushSamePath(history, done);
    });
  });

  describe("push state", () => {
    it("calls change listeners with the new location", (done) => {
      PushState(history, done);
    });
  });

  describe("push with no pathname", () => {
    it("reuses the current location pathname", (done) => {
      PushMissingPathname(history, done);
    });
  });

  describe("push with a relative pathname", () => {
    it("issues a warning", (done) => {
      PushRelativePathnameWarning(history, done);
    });
  });

  describe("replace a new path", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceNewLocation(history, done);
    });
  });

  describe("replace the same path", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceSamePath(history, done);
    });
  });

  describe("replace state", () => {
    it("calls change listeners with the new location", (done) => {
      ReplaceState(history, done);
    });
  });

  describe("location created with encoded/unencoded reserved characters", () => {
    it("produces different location objects", (done) => {
      EncodedReservedCharacters(history, done);
    });
  });

  describe("back", () => {
    it("calls change listeners with the previous location", (done) => {
      GoBack(history, done);
    });
  });

  describe("forward", () => {
    it("calls change listeners with the next location", (done) => {
      GoForward(history, done);
    });
  });

  describe("block", () => {
    it("blocks all transitions", (done) => {
      BlockEverything(history, done);
    });
  });

  describe("block a POP without listening", () => {
    it("receives the next location and action as arguments", (done) => {
      BlockPopWithoutListening(history, done);
    });
  });
}

describe('a hash history', () => {
  testHashHistory('#/')
});
