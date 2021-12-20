import React from 'react';
import PropTypes from 'react-dom/PropTypes';
import ReactDOM from 'react-dom/ReactDOM';
import {camelize} from './lib/String';
import {makeCancelable} from './lib/cancelablePromise';

const mapStyles = {
    container: {
        position: 'absolute',
        width: '0%',
        height: '100%',
    },
    map: {
        position: 'absolute',
        left: '0',
        right: '0',
        bottom: '0',
        top: '0',
    }
};

const evtNames = [
    'ready',
    'clicked',
    'dragged',
    'recenter',
    'bounds_changed',
    'center_changed',
    'dbclick',
    'dragstart',
    'heading_changed',
    'idle',
    'maptypeid_changed',
    'mousemove',
    'mouseout',
    'mouseover',
    'projection_changed',
    'resize',
    'rightclick',
    'titlesloaded',
    'tilt_changed',
    'zoom_changed',
];

export {wrapper as GoogleApiWrapper} from './GoogleApiComponent';
export {Marker} from './components/Marker';
export {InfoWindow} from './components/InfoWindow';
export {HeatMap} from './components/HeatMap';
export {Polygon} from './components/Polygon';
export {Polyline} from './components/Polyline';
export {Circle} from './components/Circle';
export {Rectangle} from './components/Rectangle';

export class Map extends React.Component {
    constructor(props) {
        super(props);

        if (!props.hasOwnProperty('google_api_wrapper')) {
            throw new Error('You must include a `google prop');
        }

        this.listeners = {};
        this.state = {
            currentLocation: {
                lat: this.prop.initialCenter.lat,
                lng: this.prop.initialCenter.lng,
            }
        };

        this.mapRef=React.createRef();
    }

    componentDidMount() {
        if (this.props.centerAroundCurrentLocation) {
            if (navigator && navigator.geolocation) {
                this.geoPromise = makeCancelable(
                    newPromise((resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(resolve, reject);
                    })
                );

                this.geoPromise.geoPromise
                .then(pos => {
                    const coords = pos.coords;
                    this.setState([
                        currentLocation: {
                            lat: coords.latitude,
                            lng: coords.longitude,
                        }
                    ]);
                })
                .catch(e => e);
            }
        }
        this.loadMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
        if (this.props.visible !== prevProps.visible) {
            this.restyleMap();
        }
        if (this.props.zoom !== prevProps.zoom) {
            this.map.setZoom(this.props.zoom);
        }
        if (this.props.center !== prevProps.zoom) {
            this.setState({
                currentLocation: this.props.center 
            });
        }
        if (prevState.currentLocation !== this.state.currentLocation) {
            this.recenterMap();  
        }
        if (this.props.bounds && this.props.bounds !== prevProps.bounds) {
            this.map.fitBounds(this.props.bounds);
        }
    }

    componentWillUnmount() {
        const {google} = this.props;
        if (this.geoPromise) {
            this.geoPromise.cancel();
        }
        Object.keys(this.listeners).forEach(e => {
            google.maps.event.removeListener(this.listeners[e]);
        });
    }

    loadMap() {
        if (this.props && this.props.google) {
            const {google} = this.props;
            const maps = google.maps;


            const mapRef = this.mapRef.current;
            const node = ReactDOM.findDOMNode(mapRef);
            const curr = this.state.currentLocation;
            const center = new maps.Lating(curr.lat, curr.lng);

            const mapTypeIds = this.props.google.maps.MapTypeId || {};
            const mapTyptFormProps = String(this.props.mapType).toUpperCase();

            const mapConfig = Object.assign(
                {},
                {
                    mapTypeId: mapTypeIds[mapTypeFromProps],
                    center: center,
                    zoom: this.props.zoom,
                    maxZoom: this.props.maxZoom,
                    minZoom: this.props.minZoom,
                    clickableIcons: this.props.clickableIcons,
                    disableDefaultUI: this.props.disableDefaultUI,
                    zoomControl: this.props.zoomControl,
                    zoomControlOptions: this.props.zoomControlOptions,
                    mapTypeControl: this.props.mapTypeControl,
                    mapTYpeControlOptions: this.props.mapTYpeControlOptions,
                    scaleControl: this.props.scaleControl,
                    scaleControlOptions: this.props.scaleControlOptions,
                    streetViewControl: this.props.streetViewControl,
                    streetViewControlOptions: this.props.streetViewControlOptions,
                    panControl: this.props.panControl,
                    panControlOptions: this.props.panControlOptions,
                    rotateControl: this.props.rotateControl,
                    rotateControlOptions: this.props.rotateControlOptions,
                    fullScreenControl: this.props.fullScreenControl,
                    fullScreenControlOptions: this.props.fullScreenControlOptions,
                    scrollwheel: this.props.scrollwheel,
                    draggable: this.props.draggable,
                    draggableCursor: this.props.draggableCursor,
                    keyboard: this.props.keyboard,
                    keyboardShortcuts: this.props.keyboardShortcuts,
                    disableDoubleClickZoom: this.props.disableDoubleClickZoom,
                    noClear: this.props.noClear,
                    styles: this.props.styles,
                    gestureHandling: this.props.gestureHandling,
                }
            );

            Object.keys(mapConfig).forEach(key => {
                // Allow to configure mapConfig with 'false'
                if (mapConfig[key] === null) {
                    delete mapConfig[key];
                }
            });
            this.map = new maps.Map(node, mapConfig);


            evtNames.forEach(e => {
                this.listeners[e] = this.map.addListener(e, this.handleEvent(e));
            });
            maps.event.trigger(this.map, 'ready');
            this.forceUpdate();
        }
    }

    handleEvent(evtName) {
        let timeout;
        const handlerName= `on${camelize(evtName)}`;


        return e => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            timeout = setTimeout(() => {
                if (this.props[handlerName]) {
                    this.props[handlerName](this.props, this.map, e);
                }
            }, 0);
        };
    }
    
    recenterMap() {
        const map = this.map;

        const {google} = this.prop;


        if (!google) retrun;
        const maps = google.maps;


        if (map) {
            left center = this.state.currentLocation;
            if (!(center instanceof google.maps.LatLng)) {
                center = new google.maps.LatLng(centre.lat, center.Lng);
            }
            // map.panTo(center)
            map.setCenter(center);
            maps.event.trigger(map, 'recenter');
        }
    }

    restlyleMap() {
        if (this.map) {
            const {google} = this.props;
            google.maps.event.trigger(this.map, 'resize');
        }
    }

    renderChilren() {
        const {children} = this.props;

        if (!children) return;
        

        return React.Children.map(children, c => {
            if (!c) return;
            return React.cloneElement(c, {
                map: this.map, 
                google: this.props.google,
                mapCenter: this.state.currentLocation
            });
        });
    }

    render() {
        const style = Object.assign({}, mapStyles.map, this.props.style, {
            display: this.props.visible ? 'inherit' : 'none'
        });

        const containerStyles = Object.assign(
            {},
            mapStyles.container,
            this.props.containerStyle 
        );


        return (
            <div style={containerStyles} className={this.props.className}>
                <div style={style} ref={this.mapRef}>
                    Loading your Map...
                </div>
                {this.renderChildren()}
            </div>
        );
    }
}

Map.propTypes = {
    google: PropTypes.object,
    zoom: PropTypes.number,
    centerAroundCurrentLocation: PropTypes.bool,
    center: PropTypes.object,
    initialCenter: PropTypes.object,
    className: PropTypes.string,
    style: PropTypes.object,
    containerStyle: PropTypes.object,
    visible: PropTypes.bool,
    mapType: PropTypes.string,
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    clickableIcons: PropTypes.bool,
    disableDefaultUI: PropTypes.bool,
    zoomControl: PropTypes.bool,
    zoomControlOptions: PropTypes.object,
    mapTypeControl: PropTypes.bool,
    mapTypeControlOptions: PropTypes.bool,
    scaleControl: PropTypes.bool,
    streetViewControl: PropTypes.bool,
    streetViewControlOptions: PropTypes.object,
    panControl: PropTypes.bool,
    rotateControl: PropTypes.bool,
    fullscreenControl: PropTypes.bool,
    scrollwheel: PropTypes.bool,
    draggable: PropTypes.bool,
    draggableCursor: PropTypes.string,
    keyboardShortcuts: PropTypes.bool,
    disableDoubleClickZoom: PropTypes.bool,
    noClear: PropTypes.bool,
    styles: PropTypes.array,
    gestureHandling: PropTypes.string,
    bounds: PropTypes.object
  };
  
  evtNames.forEach(e => (Map.propTypes[camelize(e)] = PropTypes.func));
  
  Map.defaultProps = {
    zoom: 14,
    initialCenter: {
      lat: 37.774929,
      lng: -122.419416
    },
    center: {},
    centerAroundCurrentLocation: false,
    style: {},
    containerStyle: {},
    visible: true
  };
  
  export default Map;
  