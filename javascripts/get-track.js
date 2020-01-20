const axios = require('axios')

axios({
    url: 'https://accounts.spotify.com/api/token',
    method: 'post',
    params: {
      grant_type: 'client_credentials'
    },
    headers: {
      'Accept':'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    auth: {
      username: 'YOUR-CLIENT-ID',
      password: 'YOUR-CLIENT-SECRET'
    }
  }).then(function(response) {
      console.log(response);
  }).catch(function(error) {
  });