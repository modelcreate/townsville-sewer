import { PathCreator } from '.';


it('basic test', () => {

  const trip = {
    'path': [[146.732177, -19.404646],
    [146.732126, -19.404483],
    [146.731923, -19.403834],
    [146.731923, -19.403834]]
  }

  const tripEqual = {
    'path': [[146.732177, -19.404646, 10],
    [146.732126, -19.404483, 18907.57008329812],
    [146.731923, -19.403834, 94148.23649055166],
    [146.731923, -19.403834, 94148.23649055166]]
  }



  const tripWithTime = PathCreator(trip, 10)

  expect(tripWithTime).toEqual(tripEqual);

})
