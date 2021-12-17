import React from 'react';
import GoogleMapReact from 'google-map-react';
import { Paper, Typography, useMediaQuery } from '@material-ui/core';
import {LocationOnOutlined} from '@material-ui/icons';
import {Rating} from '@material-ui/lab';
import useStyles from './styles';
import  mapStyles  from './mapStyles'


const Map = ({ setCoordinates, setBounds, coordinates, places, setChildClick, weatherData }) => {
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width: 600px)');
  
  return (
    <div className={classes.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
        defaultCenter={coordinates}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        options={{ disableDefaultUI: true, zoomControl: true, styles: mapStyles}}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
        }}
        onChildClick={(child) => setChildClick(child)}
      >
        {places?.map((place, i) => (
          <div
            className={classes.markerContainer}
            lat={Number(place.latitude)}
            lng={Number(place.longitude)}
            key={i}
          >
            {!isDesktop ? (
              <LocationOnOutlined color="primary" fontSize="large" />
            ) : (
              <Paper elevation={3} className={classes.paper}>
                <Typography
                  className={classes.typography}
                  variant="subtitle2"
                  gutterBottom
                >
                  {place.name}
                </Typography>
                <img
                  src={
                    place.photo
                      ? place.photo.images.large.url
                      : 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png'
                  }
                  alt={place.name}
                  className={classes.pointer}
                />
                <Rating size="small" value={Number(place.rating)} readOnly />
              </Paper>
            )}
          </div>
        ))}
        {weatherData?.list?.map((data, i) => (
          <div key={i} lat={data.coord.lat} lng={data.coord.lon}>
            <img height={100} src={`https://openweathermap.org/img/w/${data.weather[0].icon}.png`} alt="" />
          </div>
        ))}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
