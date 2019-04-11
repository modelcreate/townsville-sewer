
import distance from '@turf/distance';
import { point } from '@turf/helpers';

interface SewerPath {
  path: number[][];
}

interface SewerPathTime {
  path: number[][];
}

const PathCreator = (sewerFlow: SewerPath, startValue: number): SewerPathTime => {

  const test = sewerFlow.path.reduce((accumulator: number[][], currentValue, currentIndex, orgPath) => {

    if (currentIndex === 0) {
      return accumulator.concat([currentValue.concat(startValue)]);
    } else {

      const previousCoord = orgPath[currentIndex - 1]
      const from = point(previousCoord)
      const to = point(currentValue)
      const dist = distance(from, to, { units: 'kilometers' }) * 1000

      //assuming 1m/s, time is in milliseconds
      const timeToArrive = accumulator[currentIndex - 1][2] + (dist)

      return accumulator.concat([currentValue.concat(timeToArrive)]);

    }


  }, []);

  return { path: test }

}

export { PathCreator }