import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  Circle
} from "react-google-maps";

var jsonObj;

const ws = new WebSocket('ws://localhost:8090');

class MyMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      lng: 0,
      acc: 0,
    };
    
  }


  UNSAFE_componentWillMount(){
    ws.onmessage = (message) => {
      console.log(message.data);
      jsonObj = JSON.parse(message.data);
      this.setState({
        lat: jsonObj.Latitude,
        lng: jsonObj.Longitude,
        acc: Number(jsonObj.Accuracy),
      });
    }

    ws.onopen = () => {
      console.log('Connected')
    }

    ws.onclose = () => {
      console.log('Disconnected')
    }
  }

  render() {
    const { p } = this.props;
    const { lat, lng, acc } = this.state;
    console.log(lat, lng, acc)
    return (
      <div>
        <GoogleMap
          ref={map => {
            this.map = map;
            if (map && lat && lng) {
              //console.log(bounds);
              //const bounds = new google.maps.LatLngBounds({ lat, lng });
              //map.fitBounds(bounds);
              map.panTo({ lat, lng });
            }
          }}
          zoom={16}
          defaultCenter={{ lat, lng }}
        >
          {p.isMarkerShown && (
            <Marker position={{ lat, lng }} />
          )} {p.isMarkerShown && (
            <Circle center={{lat, lng}}
             radius= {acc} />
          )}
        </GoogleMap>
       Latitude {lat} <br />
       Longitude {lng} <br />
       Accuracy {acc}
      </div>
    );
  }
}


const MyMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDNjpHU_Fxjkx7q2mjCfoA2zU2f7EXTWoI&v&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `800px` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => <MyMap p={props} />);

ReactDOM.render(<MyMapComponent isMarkerShown />, document.getElementById("root"));
