import { StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import MapView, {Marker} from 'react-native-maps';
import tw from 'tailwind-react-native-classnames';
import { useDispatch, useSelector } from 'react-redux';
import { selectDestination, selectOrigin, setTravelTimeInformation } from '../slices/navSlice';
import { setOrigin } from '../slices/navSlice';
import MapViewDirections from 'react-native-maps-directions';
import { SECRET_KEY } from "@env";
import { useRef } from 'react';

const Map = () => {
    const origin = useSelector(selectOrigin);
    const destination = useSelector(selectDestination);
    const mapRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!origin || !destination) return;

        //Zoom & fit to markers
        mapRef.current.fitToSuppliedMarkers(["origin","destination"], {
            edgePadding: { top:50, left:50, right:50, bottom:50 },
        })
    }, [origin, destination]);

    useEffect(()=>{
        if (!origin || !destination) return;

        const getTravelTime = () => {

            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=metrical&origins=${origin.description}&destinations=${destination.description}&key=${SECRET_KEY}`)
            .then(res => res.json())
            .then((data) =>{
                dispatch(setTravelTimeInformation(data.rows[0].elements[0]))
            })
        }
        getTravelTime()
    }, [origin, destination, SECRET_KEY])

    return (
        <MapView
            ref={mapRef}
            style={tw`flex-1`}
            mapType="mutedStandard"
            initialRegion={{
                latitude: origin.location.lat,
                longitude: origin.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
        >
            {origin && destination &&(
                <MapViewDirections 
                    origin={origin.description}
                    destination={destination.description}
                    apikey={SECRET_KEY}
                    strokeWidth={3}
                    strokeColor="black"
                />
            )}

            {origin?.location && (
                <Marker
                coordinate={{
                    latitude: origin.location.lat,
                    longitude: origin.location.lng, 
                }}
                title="Origin"
                description={origin.description}
                identifier="origin"
                />
            )}
            {destination?.location && (
                <Marker
                coordinate={{
                    latitude: destination.location.lat,
                    longitude: destination.location.lng, 
                }}
                title="Destination"
                description={destination.description}
                identifier="destination"
                />
            )}
        </MapView>

    )
}

export default Map

const styles = StyleSheet.create({})