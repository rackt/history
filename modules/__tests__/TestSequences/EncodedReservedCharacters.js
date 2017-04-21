import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    () => {
      // encoded string
      const pathname = '/view/%23abc'
      history.replace(pathname)
    },
    (location) => {
      expect(location).toMatch({
        pathname: '/view/%23abc'
      })

      // encoded object
      const pathname = '/view/%23abc'
      history.replace({ pathname })
    },
    (location) => {
      expect(location).toMatch({
        pathname: '/view/%23abc'
      })
      // unencoded string
      const pathname = '/view/#abc'
      history.replace(pathname)
    }
    ,
    (location) => {
      expect(location).toMatch({
        pathname: '/view/',
        hash: '#abc'
      })
      // unencoded object
      const pathname = '/view/#abc'
      history.replace({ pathname })
    },
    (location) => {
      expect(location).toMatch({
        pathname: '/view/#abc'
      })
    }
  ]

  execSteps(steps, history, done)
}