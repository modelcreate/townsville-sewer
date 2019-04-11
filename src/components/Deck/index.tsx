import React from 'react';
import { FeatureCollection, Geometries, Properties, Feature, Geometry } from '@turf/helpers';

import DeckGL, { GeoJsonLayer, PathLayer } from 'deck.gl';
import { TripsLayer } from '@deck.gl/experimental-layers';
import { StaticMap } from 'react-map-gl';
import nodeData from '../../data/nodes.json';
import pipeData from '../../data/pipes.json';
import Tracer from '../../utils/tracer'
import { PathCreator } from '../../utils/PathCreator';

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// Initial viewport settings
const initialViewState = {
  longitude: 146.732177,
  latitude: -19.404646,
  zoom: 10,
  pitch: 0,
  bearing: 0
};






const trace = new Tracer(nodeData, pipeData);
const path: any[] = []



for (let i = 0; i < 20000; i++) {
  const features: Feature[] = (nodeData as FeatureCollection).features
  const rndFeature = features[Math.floor(Math.random() * features.length)];

  if (rndFeature.properties && rndFeature.properties.id) {
    //console.log(rndFeature.properties.id)
    const constsewerPath = trace.find(rndFeature.properties.id)
    const sewerPathTime = PathCreator(constsewerPath[0], i)
    path.push(sewerPathTime)
  }
}
//console.log(path)

type DeckProps = {
  loopLength: number,
  animationSpeed: number

}

interface DeckState {
  traceLine?: [{ path: number[][] }],
  time: number
}

class Deck extends React.Component<DeckProps, DeckState> {

  state: Readonly<DeckState> = {
    time: 0
  };

  _animationFrame: number | null = null

  componentDidMount() {
    this._animate(0);
  }

  componentWillUnmount() {
    if (this._animationFrame) {
      window.cancelAnimationFrame(this._animationFrame);
    }
  }

  _animate(timeStamp: number) {
    const {
      loopLength, // unit corresponds to the timestamp in source data
      animationSpeed // unit time per second
    } = this.props;
    //const timestamp = Date.now();
    //const loopTime = loopLength / animationSpeed;

    this.setState({
      //time: ((timestamp % loopTime) / loopTime) * loopLength
      time: timeStamp / 5
    });
    this._animationFrame = window.requestAnimationFrame(this._animate.bind(this));
  }

  _getLayers() {

    const trips = new TripsLayer({
      id: 'trips',
      data: path,
      getPath: d => d.path,
      getColor: [255, 0, 0],
      opacity: 1,
      strokeWidth: 20,
      trailLength: 250,
      currentTime: this.state.time
    })


    const nodes = new GeoJsonLayer({
      id: 'geojson-node',
      data: nodeData,
      pickable: false,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 1,
      lineWidthMinPixels: 1,
      getFillColor: [160, 160, 180, 255],
      getRadius: 1,
      onHover: ({ object, x, y }) => {
        if (object !== undefined) {
          const traceL = trace.find(object.properties.id)
          this.setState({ traceLine: traceL });
        }
      }
    });

    const pipes = new GeoJsonLayer({
      id: 'geojson-pipes',
      data: pipeData,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: true,
      lineWidthScale: 1,
      lineWidthMinPixels: 1,
      getLineWidth: 1,
      getLineColor: [60, 0, 0, 50],
      getRadius: 1,
      onHover: ({ object, x, y }) => {
        if (object !== undefined) {
          const traceL = trace.find(object.properties.id)
          this.setState({ traceLine: traceL });
        }
      }
    });

    const layers = [
      //pipes,
      nodes,
      trips

    ]

    if (this.state !== null && this.state.traceLine !== null) {
      layers.push(new PathLayer({
        id: 'path-layer',
        data: this.state.traceLine,
        pickable: true,
        widthScale: 1,
        widthMinPixels: 2,
        positionFormat: `XY`,
        getPath: d => d.path,
        getColor: [0, 255, 0, 255],
        getWidth: d => 5
      }))
    }


    return layers

  }
  render() {


    return (
      <DeckGL
        initialViewState={initialViewState}
        controller={true}
        layers={this._getLayers()}
      >
        <StaticMap width={"100%"} height={"100%"} mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      </DeckGL>
    );
  }
}

export default Deck