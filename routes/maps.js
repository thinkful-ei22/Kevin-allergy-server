const request = require('request');
const express = require('express');
// const axios = require('axios');
const router = express.Router();

//backend call to google maps api because front-end gives me CORS

router.get('/markers/:lat/:lng/:API_KEY', (req, res, next) => {
  const {lat, lng, API_KEY} = req.params;
  console.log(lat, lng, API_KEY);
  const googleUrlCall = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=pharmacies&key=${API_KEY}`;
  request(googleUrlCall, (err, _res, data)=> {
    if(err){
      console.log('There was an error generating the data.', err);
    }else{
      console.log(typeof JSON.parse(data));
      console.log('Im sending back the data');
      res.json(JSON.parse(data));
    }
  });
});

// router.get('/markers/:lat/:lng/:API_KEY', (req, res, next) => {
//   const {lat, lng, API_KEY} = req.params;
//   console.log(lat, lng, API_KEY);
//   const googleUrlCall = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&keyword=pharmacies&key=${API_KEY}`;
//   axios.get(googleUrlCall)
// });

module.exports = router;