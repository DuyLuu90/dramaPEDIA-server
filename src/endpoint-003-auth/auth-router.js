const express= require('express')
const bodyParser= express.json()

const AuthRouter= express.Router()
const AuthService= require('./auth-service')

//MIDDLEWARE:
const {loginValidation}= require('../middleware/form-validation')

AuthRouter
    .post('/login',bodyParser,(req,res,next)=>{
        const {username,password}= req.body
        //const loginUser= {username,password}

        const errorMessage= loginValidation(req,res,next)
        if (errorMessage) {
            return res.status(400).json({error:errorMessage})
        }

        AuthService.getUserWithUserName(req.app.get('db'),username)
        .then(dbUser=>{
            if(!dbUser) return res.status(400).json({error:`Incorrect username or password`})
            AuthService.comparePasswords(password,dbUser.password)
                .then(compareMatch=>{
                    if (!compareMatch) {
                        return res.status(400).json({error:`Incorrect username or password`})
                    }
                    const sub= dbUser.username
                    const payload={userid: dbUser.id}
                    return res.send({
                        authToken: AuthService.createJwt(sub,payload)
                    })
                })
            
        })
        .catch(next)
    })

module.exports= AuthRouter