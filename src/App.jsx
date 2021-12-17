import './App.scss';
import { Header, Map, List } from './components';
import { CssBaseline, Grid } from '@material-ui/core';
import { getPlacesData, getWeatherData } from './api/index';
import { useEffect } from 'react';
import { useState } from 'react';

function App() {
  const [places, setPlaces] = useState([]);
  const [weatherData, setWeatherData] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [bounds, setBounds] = useState({});
  const [childClick, setChildClick] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');
  const [autocomplete, setAutocomplete] = useState(null)
 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setCoordinates({ lat: latitude, lng: longitude });
      }
    );
  }, []);

  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);
    setFilteredPlaces(filtered)
  }, [rating])

  useEffect(() => {
    if (bounds.sw && bounds.ne) {
    setIsLoading(true);
    getWeatherData(coordinates.lat, coordinates.lng).then((data) => setWeatherData(data))
    getPlacesData(type, bounds.sw, bounds.ne).then((data) => {
      setPlaces(data?.filter((place) => place.name && place.num_reviews > 0));
      setFilteredPlaces([])
      setIsLoading(false);
    })};
  }, [type, bounds]);
  
  const onLoad = (autoC) => setAutocomplete(autoC);

  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoordinates({ lat, lng });
  };




  return (
    <>
      <CssBaseline />
      <Header onLoad={onLoad} onPlaceChanged={onPlaceChanged} />
      <Grid container spacing={3} style={{ width: '100%' }}>
        <Grid item xs={12} md={4}>
          <List 
          places={filteredPlaces.length ? filteredPlaces : places} 
          childClick={childClick} 
          isLoading={isLoading}
          type={type}
          setType={setType}
          rating={rating}
          setRating={setRating}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Map
            setCoordinates={setCoordinates}
            setBounds={setBounds}
            coordinates={coordinates}
            places={filteredPlaces.length ? filteredPlaces : places}
            setChildClick={setChildClick}
            weatherData={weatherData}
          />
        </Grid>
      </Grid>
    </>
  );
}

export default App;
