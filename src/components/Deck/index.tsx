import React from 'react';
import DeckGL, { GeoJsonLayer, PathLayer } from 'deck.gl';
import { StaticMap } from 'react-map-gl';
import nodeData from '../../data/nodes.json';
import pipeData from '../../data/pipes.json';
import Tracer from '../../utils/tracer'

// Set your mapbox access token here
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// Initial viewport settings
const initialViewState = {
  longitude: 146.783978,
  latitude: -19.279793,
  zoom: 13,
  pitch: 0,
  bearing: 0
};


const trace = new Tracer(nodeData, pipeData);


interface DeckState {
  traceLine?: [{ path: number[][] }]
}

class Deck extends React.Component<{}, DeckState> {


  _getLayers() {


    const nodes = new GeoJsonLayer({
      id: 'geojson-node',
      data: nodeData,
      pickable: true,
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
      getLineColor: [180, 0, 0, 200],
      getRadius: 1,
      onHover: ({ object, x, y }) => {
        if (object !== undefined) {
          const traceL = trace.find(object.properties.id)
          this.setState({ traceLine: traceL });
        }
      }
    });

    const layers = [
      pipes,
      nodes

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

    console.log(layers)

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