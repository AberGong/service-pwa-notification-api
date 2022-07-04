const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require('cors');

const subscriptionHandler = require('./subscriptionHandler')

const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json');

const app = express();

// app.use(cors());
app.use(
  cors()
);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/test', function(req, res) {
  res.send('haha2')
})

app.get('/publicKey',subscriptionHandler.getPublicKey)
app.post("/subscription", subscriptionHandler.handlePushNotificationSubscription);
app.get("/subscription/:id", subscriptionHandler.sendPushNotification);

app.listen(8080, () => {
  console.log(`Example app listening on port ${8080}`)
})

