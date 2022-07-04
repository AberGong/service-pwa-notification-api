const subscriptions = {};
var crypto = require("crypto");


function createHash(input) {
  console.log('input:',input)
  const md5sum = crypto.createHash("md5");
  md5sum.update(Buffer.from(input));
  return md5sum.digest("hex");
}

const webpush = require("web-push");


function getPublicKey(req, res) {
  const vapidKeys = webpush.generateVAPIDKeys()
  webpush.setVapidDetails(
    "mailto:example@yourdomain.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  res.status(200).json({key:vapidKeys.publicKey})
}

function handlePushNotificationSubscription(req, res) {
  const subscriptionRequest = req.body;
  const susbscriptionId = createHash(JSON.stringify(subscriptionRequest));
  subscriptions[susbscriptionId] = subscriptionRequest;
  res.status(201).json({ id: susbscriptionId });
}



function sendPushNotification(req, res) {
  for (key in subscriptions) {
    webpush
    .sendNotification(
      subscriptions[key],
      JSON.stringify({
        title: "New Product Available ",
        text: "HEY! Take a look at this brand new t-shirt!",
        image: "/images/jason-leung-HM6TMmevbZQ-unsplash.jpg",
        tag: "new-product",
        url: "/new-product-jason-leung-HM6TMmevbZQ-unsplash.html"
      })
    )
    .catch(err => {
      console.log(err);
    });

  }

  res.status(202).json({});
}



module.exports = { handlePushNotificationSubscription, sendPushNotification,getPublicKey };
