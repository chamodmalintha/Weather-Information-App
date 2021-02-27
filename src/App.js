import React, { Component, useState } from 'react';
import data from './data.json';
import axios from 'axios';
import LoginButton from './login';
import LogoutButton from './logout';
import { useAuth0 } from "@auth0/auth0-react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const isAuthenticated = false;

const App = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [cityList, setCityList] = useState(data.List.map(city => {
    return city.CityCode;
  }));

  const [weatherInfo, setWeatherInfo] = useState();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  function getData() {
    if (localStorage.getItem('weather')) {
      console.log('getting the existing key');
      getLocalStorage('weather');
    } else {
      axios.get('http://api.openweathermap.org/data/2.5/group?id=' + cityList.join() + '&units=metrics&appid=a5e697bf28e349a188a6fbcb905fb128')
        .then(response => {
          setWeatherInfo(response.data.list)
          setLocalStorage('weather', response, 300000);
          console.log('no such key');
          console.log(response.data.list[0].name);
        });
    }
  } { }

  function setLocalStorage(keyName, data, ttl) {
    const now = new Date()
				const item = {
					value: data,
					expiry: now.getTime() + ttl,
				}
				localStorage.setItem(keyName, JSON.stringify(item))
  }

  function getLocalStorage(keyName) {
    const itemStr = localStorage.getItem(keyName)
				const item = JSON.parse(itemStr)
				const now = new Date()
				if (now.getTime() > item.expiry) {
					localStorage.removeItem(keyName)
          axios.get('http://api.openweathermap.org/data/2.5/group?id=' + cityList.join() + '&units=metrics&appid=a5e697bf28e349a188a6fbcb905fb128')
            .then(response => {
              setWeatherInfo(response.data.list)
              setLocalStorage(keyName, response, 300000);
              console.log('key expired so removed and new axios call to setup');
              console.log(response.data.list[0].name);
          });
				} else {
            console.log('key not expired');
            setWeatherInfo(item.value.data.list)
        }
  }


  return (
    
    <div>

      {isAuthenticated ?
        <div style={{  marginTop: '50px', textAlign: 'center'}}>
          <Button variant="contained" color="primary" onClick={() => getData()} style={{width: '310px', marginLeft: '400px', marginRight: '400px', marginBottom: '50px'}}>
  Get Weather Information </Button>
          {weatherInfo && (weatherInfo.map(
            w => {
              return (
                <div className="cardView">
                  <Card style={{width: '400px', marginLeft: '400px', marginBottom: '50px', marginTop: '50px'}}>
                    <CardActionArea>
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {w.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                          {w.weather[0].description}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                        {w.main.temp}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </div>)
              }
          )
          )}
          <LogoutButton />
        </div> :

        <div style={{  marginTop: '50px', textAlign: 'center'}}>
          <div className='App-header'> 
            <h1>Click here to Login</h1>
          </div>,
          <LoginButton />
        </div>}

    </div>
  );

};

export default App;