const Pusher = require('pusher');

const pusher = new Pusher({
    appId: "1497661",
    key: "7836396d54cdb2c2bcdd",
    secret: "5e6265ad3225f0c9f386",
    cluster: "ap2",
    useTLS: true
});

module.exports = pusher;