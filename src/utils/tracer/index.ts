import { FeatureCollection, Geometries, Properties, Feature, Geometry } from '@turf/helpers';


class Tracer {
  lookup: { [id: string]: Feature<Geometries, Properties>; }
  constructor(nodes, pipes) {

    const allFeatures: Feature<Geometry, Properties>[] = nodes.features.concat(pipes.features)

    this.lookup = allFeatures.reduce((obj, item) => {
      item.properties && (obj[item.properties.id] = item);
      return obj;
    }, {});

  }
  find(id: string): [{ path: number[][] }] {

    const path = [id]
    let looking = true
    const geo: number[][] = []
    while (looking) {
      const found = this.lookup[path[path.length - 1]]

      if (found !== null && found.properties !== null && found.geometry !== null) {

        const nextObjId = found.properties.ds
        if (found.properties.ds === null) {
          looking = false
        } else {
          path.push(nextObjId)
          if (found.geometry.type === "LineString") {
            found.geometry.coordinates.forEach((coor) => {
              geo.push(coor)
            })
          }

        }

      } else {
        looking = false
      }

    }

    return [{ path: geo }]
  }

}

export default Tracer