let expect = require('chai').expect;
let datafire = require('../lib');

describe('Flow', () => {
  it('should keep track of results', done => {
    let context = new datafire.Context();
    let resultSet = ['result0', ['foo', 'bar'], null];
    let results = {
      0: resultSet[0],
      1: resultSet[1],
      2: resultSet[2],
      r0: resultSet[0],
      r1: resultSet[1],
    }
    Promise.resolve().then(_ => {
      return datafire.flow(context)
        .then(_ => results[0])
        .then(r0 => {
          expect(r0).to.equal(results[0]);
          expect(r0).to.equal(results.r0);
          return new Promise((resolve, reject) => {
            setTimeout(_ => resolve(results[1], 10))
          })
        })
        .then(r1 => {
          expect(r1).to.equal(results[1]);
          expect(r1).to.equal(results.r1);
          return results[2];
        })
    })
    .then(_ => {
      expect(context.results).to.deep.equal(results);
    }).then(_ => {
      done();
    }).catch(e => {
      done(e);
    })
  });

  it('should allow nested promises', done => {
    let context = new datafire.Context();
    Promise.resolve()
      .then(_ => {
        datafire.flow(context)
          .then(_ => {
            return new Promise(resolve => {
              setTimeout(_ => resolve(0), 10);
            }).then(zero => {
              return 1;
            })
          })
          .then(result => {
            expect(result).to.equal(1);
            expect(context.results).to.deep.equal({
              0: 1,
              result: 1,
            })
          })
      })
      .catch(e => done(e))
      .then(_ => done());
  })

  it('should allow error handling', () => {
    let context = new datafire.Context();
    return datafire.flow(context)
      .then(_ => Promise.reject('err1'))
      .then(_ => {
        throw new Error("shouldn't reach here");
      })
      .catch(e => {
        expect(e).to.equal('err1');
      })
  });

  it('should allow nested error handling', () => {
    let context = new datafire.Context();
    return datafire.flow(context)
      .then(_ => {
        return Promise.resolve()
          .then(_ => {
            return Promise.reject("err2")
          })
      })
      .then(_ => {
        throw new Error("shouldn't reach here");
      })
      .catch(e => {
        expect(e).to.equal('err2');
      })
  })
})