var FitbitApiClient = require("fitbit-node");

var express = require("express"),
  app = express();

  var FitbitApiClient = require("fitbit-node"),
    client = new FitbitApiClient("58f3798f92cab5ff330e3ead5ad2ee15", "2d3d9799ed5e412f459465d94eed942b");

    var requestTokenSecrets = {};

    app.get("/authorize", function (req, res) {
        client.getRequestToken().then(function (results) {
              var token = results[0],
                    secret = results[1];
                        requestTokenSecrets[token] = secret;
                            res.redirect("http://www.fitbit.com/oauth/authorize?oauth_token=" + token);
                              
        }, function (error) {
              res.send(error);
                
        });
        
    });

    app.get("http://104.131.241.219:3000/#/oauth_callback", function (req, res) {
        var token = req.query.oauth_token,
            secret = requestTokenSecrets[token],
                verifier = req.query.oauth_verifier;
                  client.getAccessToken(token, secret, verifier).then(function (results) {
                        var accessToken = results[0],
                              accessTokenSecret = results[1],
                                    userId = results[2].encoded_user_id;
                                        console.log(client.get('/profile.json'));
                                        return client.get("/profile.json", accessToken, accessTokenSecret).then(function (results) {
                                                var response = results[0];
                                                      res.send(response);
                                                          
                                        });
                                          
                  }, function (error) {
                        res.send(error);
                          
                  });
                  
    });

    app.listen(3000);
