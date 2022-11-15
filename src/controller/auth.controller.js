const connection = require('../../conn');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const refreshTokens = [];

const login = async(req, res) => {
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
                    return res.status(200).send({name: user.name, id: user.id, accessToken: accessToken, refreshToken: refreshToken, expiresIn: expiresIn});
                } 
                else return res.status(400).send('invalid password');
            } catch (exc) {
                console.log(exc);
                return res.status(500).send('something went wrong');
            }
        } else {
            return res.status(400).send('invalid name');
        }
    });
};

const logout = (req, res) => {
    refreshToken = refreshTokens.filter(x => x !== req.body.token);
    res.sendStatus(204);
};

const createToken = (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccestoken({name: user.name, password: user.password})
        return res.status(200).send({accessToken: accessToken});
    });
};

function generateAccestoken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '50m'});
}


function addMinutes(numOfMinutes, date = new Date()) {
    date.setMinutes(date.getMinutes() + numOfMinutes);
  
    return date;
}

module.exports = {
    login,
    logout,
    createToken
}