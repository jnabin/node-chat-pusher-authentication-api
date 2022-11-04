require('dotenv').config();

const Express = require('express');
const connection = require('./conn');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pusher = require('./config');
const cors = require('cors');

const app = Express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors({
    origin: ['http://localhost:4200']
}))
const refreshTokens = [];

function generateAccestoken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '50m'});
}


app.get('/users', authenticateToken, (req, res) => {
    connection.query('select id, name from users', (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.get('/users/:id', authenticateToken, (req, res) => {
    connection.query('select id, name from users where id = ?', [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.delete('/users/:id', authenticateToken, (req, res) => {
    connection.query('delete from users where id = ?', [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(204).send('deleted');
    });
});

app.post('/users', async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        connection.query(`insert into users (name, password) values(?, ?)`, [req.body.name, hashedPassword], 
        (error, results, fields) => {
            if(error) res.status(500).send('something went wrong');
            let user = {id: results.insertId, name: req.body.name}
            res.status(201).send(user);
        });
    } catch(exc) {
        console.log(exc);
        res.status(500).send('something went wrong');
    }
});

app.post('/login', async(req, res) => {
    connection.query('select id, name, password from users where name = ?', [req.body.name], async(error, results, fields) => {
        if (error) res.status(500).send('something went wrong');
        if (results.length > 0) {
            const user = results[0];
            try{
                if (await bcrypt.compare(req.body.password, user.password)) {
                    const accessToken = generateAccestoken({name: user.name, password: user.password});
                    const refreshToken = jwt.sign({name: user.name, password: user.password}, process.env.REFRESH_TOKEN_SECRET);
                    refreshTokens.push(refreshToken);
                    let expiresIn = addMinutes(50);
                    res.status(200).send({name: user.name, id: user.id, accessToken: accessToken, refreshToken: refreshToken, expiresIn: expiresIn});
                } 
                else res.status(400).send('invalid password');
            } catch (exc) {
                console.log(exc);
                res.status(500).send('something went wrong');
            }
        } else {
            res.status(400).send('invalid name');
        }
    });
});

app.delete('/logout', (req, res) => {
    refreshToken = refreshTokens.filter(x => x !== req.body.token);
    res.sendStatus(204);
});

app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) res.sendStatus(403);
        const accessToken = generateAccestoken({name: user.name, password: user.password})
        res.status(200).send({accessToken: accessToken});
    });
});

app.post('/chatRooms', authenticateToken, (req, res) => {
    connection.query("insert into chat_rooms (name) values(?)", [req.body.name], (error, results, fields) => {
        if (error) res.status(500).send("something went wrong");
        res.status(201).send('created');
    });
});

app.get('/chatRooms', authenticateToken, (req, res) => {
    connection.query('select id, name from chat_rooms', (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.get('/chatRooms/:id', authenticateToken, (req, res) => {
    connection.query('select id, name from chat_rooms where id = ?', [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.post('/userTyping', function(req, res) {
    const username = req.body.username;
    const fromUser = req.body.fromUserId;
    const userOneId = req.body.user_one_id;
    const userTwoId = req.body.user_two_id;
    const channelName = req.body.chanelName ? req.body.chanelName : `private-chat-${fromUserId}-${toUserId}`;

    pusher.trigger(channelName, 'user_typing', {username: username, userId: fromUser});
    res.status(200).send();
});

app.post('/messages', authenticateToken, async(req, res) => {
    const fromUserId = req.body.fromUserId;
    const toUserId = req.body.toUserId;
    const message = req.body.message;
    const sessionId = req.body.sessionId;
    const userName = req.body.username;
    const channelName = req.body.chanelName ? req.body.chanelName : `private-chat-${fromUserId}-${toUserId}`;

    await pusher.trigger(channelName, "message", {
        fromUserId: fromUserId,
        toUserId: toUserId,
        message: message,
        userName: userName
    }).then(e => {
        connection.query("insert into messages (session_id, content, username) values(?, ?, ?)", [sessionId, message, userName], 
        (error, results, fields) => {
            if (error) res.status(500).send("something went wrong");
            let sql = "insert into chats (session_id, message_id, user_id, type) values(?, ?, ?, ?)"
            const mid = results.insertId;
            connection.query(sql, [sessionId, mid, fromUserId, 0], 
            (error, results, fields) => {
                if (error) res.status(500).send('something went wrong');
                connection.query(sql, [sessionId, mid, toUserId, 1], 
                    (error, results, fields) => {
                        console.log(error);
                        console.log(results);
                        if (error) res.status(500).send('something went wrong');
                        res.status(201).send(error);
                    });
            });

        });

    }).catch(err => {
        console.log(err);
        res.status(500).send('something went wrong');
    });
});

app.get('/messages', authenticateToken, (req, res) => {
    connection.query('select id, chat_room_id, user_id, message from chat_messages', (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.get('/messages/:id', authenticateToken, (req, res) => {
    connection.query('select  id, chat_room_id, user_id, message from chat_messages where id = ?', [req.params.id], (error, results, fields) => {
        if(error) res.status(500).send('something went wrong');
        res.status(200).send(results);
    });
});

app.post("/pusher/auth", function (req, res) {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    const user_id = req.body.user_id;
    const name = req.body.name;

    if (channel.startsWith('presence-')) {

        const presenceData = {
            user_id: user_id,
            user_info: { name: name, user_id: user_id },
        };

        const authResponse = pusher.authorizeChannel(socketId, channel, presenceData);
        res.send(authResponse);
    } else {
        const authResponse = pusher.authorizeChannel(socketId, channel);
        res.send(authResponse);
    }
});

app.post("/pusher/user-auth", (req, res) => {
    const socketId = req.body.socket_id;
    const user_id = req.body.user_id;
    const name = req.body.name;
    // Replace this with code to retrieve the actual user id and info
    const user = {
      id: user_id,
      user_info: {
        name: name,
      }
    };
    const authResponse = pusher.authenticateUser(socketId, user);
    res.send(authResponse);
  });

app.post("/sessions", authenticateToken, async(req, res) => {
    const user_one_id = req.body.user_one_id;
    const user_two_id = req.body.user_two_id;
    const from_user_id = req.body.from_user_id;
    const to_user_id = req.body.to_user_id;
    console.log('hitted');
    var channels = [ `private-notifications-${user_one_id}`, `private-notifications-${user_two_id}` ];
    console.log(channels);
    var eventData = {
                    'channel_name': `private-chat-${user_one_id}-${user_two_id}`,
                    'initiated_by': from_user_id,
                    'chat_with'   : to_user_id
                    };

    await pusher.trigger( channels, 'one-to-one-chat-request', eventData ).then(s => {
        connection.query('select * from sessions where user1_id in (?, ?) and  user2_id in (?, ?)', [user_one_id, user_two_id, user_one_id, user_two_id], (error, result, fields) => {
            if(result.length > 0) {
                let sql1 = `select chat.id as cid, chat.user_id as userid, chat.type as usertype, m.id as mid, m.username as uname,
                m.content as message, s.id as sessionId from chats chat inner join messages m on chat.message_id = m.id
                inner join sessions s on chat.session_id = s.id where s.id = ?`;
                connection.query(sql1, [result[0].id], (error, results, fields) => {
                    let messages = results;
                    res.status(200).send({id: result[0].id, messages: messages});
                });
        
            } else {
                connection.query("insert into sessions (user1_id, user2_id) values(?, ?)", [user_one_id, user_two_id], (error, results, fields) => {
                    if (error) res.status(500).send("something went wrong");
                    res.status(201).send({id: results.insertId, messages: []});
                });
            }
        });
    }).catch(e => {
        res.status(500).send('something went wrong');
    });
});

app.post("/sessionMessages", authenticateToken, (req, res) => {
    const user_one_id = req.body.user_one_id;
    const user_two_id = req.body.user_two_id;

    connection.query('select * from sessions where user1_id in (?, ?) and  user2_id in (?, ?)', [user_one_id, user_two_id, user_one_id, user_two_id], (error, result, fields) => {
        if(result.length > 0) {
            let sql1 = `select chat.id as cid, chat.user_id as userid, chat.type as usertype, m.id as mid, m.username as uname,
            m.content as message, s.id as sessionId from chats chat inner join messages m on chat.message_id = m.id
            inner join sessions s on chat.session_id = s.id where s.id = ?`;
            connection.query(sql1, [result[0].id], (error, results, fields) => {
                let messages = results;
                res.status(200).send({id: result[0].id, messages: messages});
            });
    
        } else {
            connection.query("insert into sessions (user1_id, user2_id) values(?, ?)", [user_one_id, user_two_id], (error, results, fields) => {
                if (error) res.status(500).send("something went wrong");
                res.status(201).send({id: results.insertId, messages: []});
            });
        }
    });
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
  
    return date;
  }

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Express is running at port: ${port}`));
