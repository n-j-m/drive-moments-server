var Router = require("express").Router;
var google = require("googleapis");
var drive = google.drive("v2");
var OAuth2 = google.auth.OAuth2;
var Promise = require("es6-promise").Promise;

var db = require("../db");

var secret = require(process.env.GOOGLE_APPLICATION_CREDENTIALS).web;

var authClient = new OAuth2(secret.client_id, secret.client_secret, secret.redirect_uris[0]);
var scopes = [
  "https://www.googleapis.com/auth/drive"
];

var router = Router();

router.get("/auth", function(req, res) {
  var url = authClient.generateAuthUrl({
    access_type: "offline",
    scope: scopes
  });

  res.redirect(url);
});

router.get("/oauth_callback", function(req, res) {
  authClient.getToken(req.query.code, function(err, tokens) {
    if (err) {
      res.status(500).send(err);
    }
    else {
      authClient.setCredentials(tokens);

      drive.about.get({
        auth: authClient
      },
      function(err, aboutRes) {
        if (err) {
          res.status(500).send(err);
        }
        else {
          db.set({
              access_token: tokens.access_token,
              refresh_token: tokens.refresh_token
            },
          "tokens", aboutRes.user.permissionId
          )
          .then(function() {
            res.redirect("/done");
          })
          .catch(function(err) {
            res.status(500).send(err.message);
          });
        }
      });
    }
  });
});

module.exports = router;
