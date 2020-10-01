//const AuthService = require('../endpoint-004-auth/auth-service')
const {API_TOKEN}= require('../config')

function requireBasicAuth(req,res,next) {
    const authToken = req.get(`Authorization`) || ''
    let basicToken=authToken.slice(6,authToken.length)
    if (!authToken.toLowerCase().startsWith('basic') || !authToken || basicToken!==API_TOKEN ){
        return res.status(401).json({error:`Missing basic token`});
    }
    next()
}
function requireUserToken(req,res,next) {
    const authToken = req.get(`Authorization`) || ''
    let basicToken=authToken.slice(6,authToken.length)
    const[tokenUserName, tokenPassword]= AuthService.parseBasicToken(basicToken)
    
    if (!tokenUserName || !tokenPassword) {
        return res.status(401).json({error:`Unauthorized request`})
    }
    let currentUser;
    AuthService.getUserWithUserName(req.app.get('db'),tokenUserName)
        .then(user=>{
            if(!user) res.status(401).json({error:`Unauthorized request`})
            currentUser=user;
            return AuthService.comparePasswords(tokenPassword,user.password) 
                .then(passwordsMatch=>{
                    if(!passwordsMatch) return res.status(401).json({error:'Unauthorized request'})
                    req.user=currentUser
                    next()
                })
        })
        .catch(next)
}
function requireAdminAuth(req,res,next) {

}



module.exports= {requireBasicAuth,requireAdminAuth,requireUserToken}