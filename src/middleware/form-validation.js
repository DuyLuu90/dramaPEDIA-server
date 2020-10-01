const UserService= require('../endpoint-002-users/users-service')

function userValidation(req){ 
    const {first_name,last_name,password}= req.body
    
    for( const field of ['first_name', 'last_name', 'username', 'password']) {
        if (!req.body[field]) return  `Missing ${field} in req body`
    } 

    let nameError= UserService.validateName(first_name,last_name)
    if (nameError) return nameError
    
    let passwordError= UserService.validatePassword(password)
    if (passwordError) return passwordError    
    
}
function movieValidation(req){
    
    for (const field of ['title','posterurl','trailerurl','genres','summary']) {
        if (!req.body[field]) {
            return `${field} is required`
        }
    }
}
function loginValidation(req){
    for (const field of ['username','password',]) {
        if (!req.body[field]) {
            return `Missing ${field} in request body`
        }
    }
/*
    const {username,password}= req.body
    const loginUser= {username,password}
    for (const [key,value] of Object.entries(loginUser)) {
        if(value == null) 
            return `Missing ${key} in request body`
    }
*/
}
function reviewValidation(req) {
    for (const field of ['movieid','userid','comment','rating']) {
        if(!req.body[field]) {
            return `${field} is required`
        }
    }
}
    

module.exports= {userValidation,movieValidation,loginValidation,reviewValidation}