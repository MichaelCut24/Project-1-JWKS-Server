require('dotenv').config()
const express = require('express')
const app = express()
const request = require('supertest')

const jwt = require('jsonwebtoken')
test('Should get a auth token and check if token is expired', async () => {

    const responce = await request(app).post('/auth').send({
        user: "Ken"
    })
    return responce
})