require('dotenv').config();

const Express = require('express');
const connection = require('./conn');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const pusher = require('./config')

const app = Express();
app.use(bodyParser.urlencoded({
    extended: true
  }));
const refreshTokens = [];

function generateAccestoken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
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

app.post('/users', authenticateToken, async(req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        connection.query(`insert into users (name, password) values(?, ?)`, [req.body.name, hashedPassword], 
        (error, results, fields) => {
            if(error) res.status(500).send('something went wrong');
            res.status(201).send('created');
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

                    res.status(200).send({accessToken: accessToken, refreshToken: refreshToken});
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
    pusher.trigger(chatChannel, userIsTypingEvent, {username: username});
    res.status(200).send();
});

app.post('/messages', authenticateToken, async(req, res) => {
    await pusher.trigger("chat", "message", {
        username: req.body.username,
        message: req.body.message
    });

    connection.query("insert into chat_messages (chat_room_id, user_id, message) values(?, ?, ?)", [req.body.roomId, req.body.userId, req.body.message], 
    (error, results, fields) => {
        if (error) res.status(500).send("something went wrong");
        res.status(201).send('created');
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

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Express is running at port: ${port}`));
