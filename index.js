//setting parameters
require('dotenv').config()
const express = require('express')
const app = express()

const jwt = require('jsonwebtoken')

app.use(express.json())

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
app.get('/kID', Auth, (req, res) => {
    res.json(kID.filter(kID => kID.user === req.ID.KID))
})

app.post('/auth', async (req, res) =>{

    //confirms kID's

    const user = req.body.user

    if (user == null) return res.sendStatus(401)

    const ID = { KID : user}

    //calling and returning refresh token
    const Token = tokenExpires(ID)

    res.json({Token: Token})
});

function Auth(req, res, next) {
    //Auth to make sure the right user has the correct access
    const authHead = req.headers['authorization']
    const token = authHead && authHead.split(' ')[1]
    //Error code if nothing is put into the auth
    if (token == null) return res.sendStatus(401)

    //Verify code hasn't expired
    jwt.verify(token, process.env.REFRESH_TOKEN, (err, ID) =>{
        //if code is invalid or expired than throws forbidden error
        if (err) return res.sendStatus(403)
        req.ID = ID
        next()
    })
}

//Refresh token good for 15 seconds
function tokenExpires(ID){
    return jwt.sign(ID, process.env.REFRESH_TOKEN, { expiresIn: '15s'})
}


//Better listener than me
app.listen(8080)