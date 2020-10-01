require('dotenv').config() 
const express= require('express')
const morgan= require('morgan') 
const cors = require('cors')
const helmet= require('helmet')
const {NODE_ENV}= require('./config')

const MovieRouter= require('./endpoint-001-movies/movies-router')
const UserRouter= require('./endpoint-002-users/users-router')
const AuthRouter= require('./endpoint-003-auth/auth-router')
const ReviewRouter= require('./endpoint-004-reviews/review-router')
const ArtistRouter= require('./endpoint-005-artists/artists-router')

const app= express()

app.use(cors())
/*
app.options('*', cors());
app.use(cors( {origin: CLIENT_ORIGIN} ))
app.use(function (req, res, next) { 
    res.header("Access-Control-Allow-Origin", "*") 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept") 
    next() 
})
*/

app.use(morgan(NODE_ENV === 'production'? 'tiny': 'short')) 
app.use(helmet())

app.use('/api/movies',MovieRouter)
app.use('/api/users',UserRouter)
app.use('/api/auth',AuthRouter)
app.use('/api/reviews',ReviewRouter)
app.use('/api/artists',ArtistRouter)

app.use((error, req,res, next)=>{
    let response;
    if (NODE_ENV === 'production') {
        response= {error: {message: error.message}}
    }
    else response={message: error.message, error}
    res.status(500).json(response)
})

module.exports = app 