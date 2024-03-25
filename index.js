//setting parameters
require('dotenv').config()

const jwt = require('jsonwebtoken')
const express = require('express')
const app = express()
app.use(express.json())

const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('totally_not_my_privateKeys.db')


//kID for each auth token inspired by Street Fighter Characters
const kID = [
    {
        user: 'Ken',
        title: 'Likes: Spaghetti, pasta, family, Skateboarding'
    },
    {
        user: 'Ryu',
        title: 'Likes: Martial arts in general, Mizuyokan'
    },
    {
        user: 'Chun-Li',
        title: 'Likes: Crepes, fruits, candy, Western confectionery, Days off'
    },
    {
        user: 'Guile',
        title: 'Likes: American coffee, Country Music, American automobiles, John Wayne'
    }
]



//Shows correct data if you have the right auth code
app.get('/test', check, (req, res) => {
    res.json(kID.filter(kID => kID.user === req.ID.KID))
})


function check(req, res, next) {
    //For using already
   //const authHead = req.headers['authorization']
    //const tokenChecker = authHead && authHead.split(' ')[1]
    //Error code if nothing is put into the auth
    //if (tokenChecker == null) return res.sendStatus(401)

    //Verify code hasn't expired
    jwt.verify(tokenChecker, process.env.TOKEN, (err, ID) =>{
        //if code is invalid or expired than throws forbidden error
        if (err) return res.sendStatus(404)
        req.ID = ID
        next()
    })
}



//Refresh token good for 15 seconds
function tokenExpires(ID){
    return jwt.sign(ID, process.env.TOKEN, { expiresIn: '3600s'})
}

//post /auth
app.post('/auth', async (req, res) =>{

    //confirms kID's

    const user = req.body.user

    const ID = { KID : user}

    //calling token and setting the token to a Token (tokeception)

    const Token = db.each("SELECT exp FROM keys")
    res.json({Token: Token})


    db.serialize(() => {
        const T0ken = process.env.TOKEN;
        db.run("CREATE TABLE IF NOT EXISTS keys ( kid BLOB PRIMARY KEY AUTOINCREMENT, k3y BLOB NOT NULL, exp BLOB NOT NULL)")
        db.run("INSERT INTO keys (kid, k3y, exp) VALUES("+T0ken+"'," +ID+",'"+tokenExpires(ID)+ "')")
    });
    db.close();

});



//Better listener than me
app.listen(8080)