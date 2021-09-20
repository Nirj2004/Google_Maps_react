import React from 'react'
import Proptypes from 'prop-types'
import ReactDOM from 'react-dom'
import ReactDomServer from 'react-dom/server'

export class InfoWindow extends React.Component {

    componentDidMount() {
        this.renderInfoWindow();
    }


    componentDidUpdate(prevProps) {
        const {google, map} = this.props;

        if (!google || !map) {
            return;
        }

        if (map !== prevProps.map) {
            this.renderInfoWindow();
        }

        if (this.props.position !== prevProps.position) {
            this.updatePosition();
        }

        if (this.props.children !== prevProps.children) {
            this.updateContent();
        }

        if ((this.props.visible !== precProps.visible ||
            this.props.marker !== prevProps.marker ||
            this.props.position !== prevProps.position)) {
                this.props.visible ? 
                  this.openWindow() :
                  this.closeWindow();
        }
    }

    renderInfoWindow() {
        const {
            map,
            google,
            mapCenter,
            ...props 
        } = this.props;

        if (!google || !google.maps) {
            return;
        }

        const iw = this.InfoWindow = new google.maps.InfoWindow({
            content: '',
            ...props 
        });

        google.maps.event
          .addListener(iw, 'closeclick', this.onClose.bind(this))
        google.maps.event  
          .addListener(iw, 'domready', this.open.bind(this));
    }

    onOpen() {
        if (this.props.onOpen) {
            this.props.onOpen();
        }
    }


    onClose() {
        if (this.props.onClose) {
            this.props.onClose();
        }
    }

    openWindow() {
        this.InfoWindow.open(this.props.map, this.props,marker);
    }

    updatePosition() {
        let pos = this.props.position;
        if (!(pos instanceof google.maps.LatLng)) {
            pos = pos && new.google.maps.LatLng(pos.lat, pos.lng);
        }
        this.InfoWindow.setPosition(pos);
    }


    updateContent() {
        const Content = this.renderChildren();
        this.InfoWindow.setContent(content);
    }

    closeWindow() {
        this.InfoWindow.close();
    }

    renderChildren() {
        const {children} = this.props;
        return ReactDOMServer.renderToString(children);
    }

    render() {
        return null;
    }
}

InfoWindow.propTypes = {
    children: Proptypes.element.isRequired,
    map: Proptypes.object,
    marker: Proptypes.object,
    position: Proptypes.object,
    visible: Proptypes.bool,

    // callbacks
    onClose: Proptypes.func,
    onOpen: Proptypes.func
}

InfoWindow.defaultProps = {
    visible: false
}


export default InfoWindow