const xss= require('xss')
const Treeize = require('treeize')
const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/
const validLetters=/^[A-Za-z ]+$/

const UserService= {
    insertNewUser(db,newUser){  
        return db.insert(newUser).into('users')
            .returning('*').then(rows=>rows[0])
    },
    getBlockedUsers(db){
        return db('users').where(block_list='true')
    },
    hasUserWithUserName(db,username){
        return db('users').where({username})
            .first()
            .then(user=>!!user)
    },
    validateName(firstName,lastName){
        const fullName=firstName+lastName
        if (!validLetters.test(fullName)) {
            return 'Names must contain only valid letters'
        }
        return null
    },
    validatePassword(password){
        if(password.length<8){
            return 'Password must be longer than 8 characters'
        }
        if(password.length>72){
            return 'Password must be shorter than 72 characters'
        }
        if(password.startsWith(' ')||password.endsWith(' ')){
            return 'Password must not start or end with empty spaces'
        }
        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)){
            return 'Password must contain 1 upper case,lower case,number and special character'
        }
        return null
    },
    hashPassword(password){
        return bcrypt.hash(password,12)
    },
    serializeUser(user) {
        return {
            id: user.id,
            first_name: xss(user.first_name),
            last_name: xss(user.last_name),
            username: xss(user.username),
            nickname: xss(user.nickname),
            country: user.country,
            age: user.age,
            gender: user.gender,
            last_modified: new Date(user.last_modified)
        }
    }
}

module.exports= UserService