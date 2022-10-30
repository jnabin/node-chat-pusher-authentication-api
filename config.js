const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "your app id",
    key: "your app key",
    secret: "your secret key",
    cluster: "your cluster",
    useTLS: true
});

module.exports = pusher;