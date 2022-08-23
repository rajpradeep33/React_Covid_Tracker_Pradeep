import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import "./LeafletMap.scss";
import { showDataOnMap } from '../../utils';

function LeafletMap({ countriesWithData, center, zoom, caseType }) {
    return (
        <div className="map">
            <Map center={center} zoom={zoom}>
                <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {showDataOnMap(countriesWithData, caseType)}
            </Map>
        </div>
    )
}

export default LeafletMap;
