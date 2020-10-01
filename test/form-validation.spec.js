const knex= require('knex')
//const helpers= require('./test-helpers')
const app= require('../src/app')

const {prepareTest,tools} = require('./test-helpers')


//SUMMARY= {Number-of-tests: 10,Passed: 10, Failed:0, Skipped:0} 

describe('FORM VALIDATION',()=>{
    const {testMovies,testUsers,testArtists,testReviews,testCasts}= prepareTest.getData()
    const data= {testMovies,testUsers,testArtists,testReviews,testCasts}
    testUser=testUsers[0]
    
    let db
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db',db)
      })
    
    before('cleanup', () => prepareTest.cleanTables(db))
    afterEach('cleanup', () => prepareTest.cleanTables(db))
    after('disconnect from db', () => db.destroy())

    describe('POST /api/users',()=>{
        const requiredFields=['first_name', 'last_name', 'username', 'password']
        requiredFields.forEach(field=>{
            const registerAttemptBody= {
                first_name: 'test first name', last_name: 'test last name', 
                username:'test username', password:'test password',
            }
            it(`responds 400 when ${field} is missing`,()=>{
                delete registerAttemptBody[field]
                return supertest(app).post('/api/users')
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .send(registerAttemptBody)
                    .expect(400,{
                        error: `Missing ${field} in req body`
                    })
                })
        })
        const {newUser}= tools.makeNewItem()
        describe('New USER validation',()=>{
            beforeEach('Insert users',()=>db('users').insert(testUsers))
            const array=[
                {name:'Name with invalid letter',invalidUser:{...newUser,first_name:'first@name'},
                message:'Names must contain only valid letters'},
                {name:'Short password',invalidUser:{...newUser,password:'aA1!'},
                message:'Password must be longer than 8 characters'},
                {name:'Long password',invalidUser:{...newUser,password:'*'.repeat(73)},
                message:'Password must be shorter than 72 characters'},
                {name:'Password starts with space',invalidUser:{...newUser,password:' aA1!aA1!'},
                message:'Password must not start or end with empty spaces'},
                {name:'Password ends with space',invalidUser:{...newUser,password:'aA1!aA1! '},
                message:'Password must not start or end with empty spaces'},
                {name:`Password isn't complex enough`,invalidUser: {...newUser,password:'abcdefghi'},
                message:'Password must contain 1 upper case,lower case,number and special character'},
                {name:`Username is not unique`,invalidUser: {...newUser,username: testUsers[1].username},
                message:'Username already taken'},
            ]
            array.forEach(obj=>{
                it(obj.name,()=>{
                    return supertest(app).post('/api/users')
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .send(obj.invalidUser)
                    .expect(400,{error: obj.message})
                })
            })
        })
    })
    
    describe('POST api/auth/login',()=>{
        beforeEach('Insert users',()=>db('users').insert(testUsers))
        const requiredFields=[`username`,`password`]
        requiredFields.forEach(field=>{
            const loginAttemptBody = {
                username: testUser.username,
                password: testUser.password
            }
            it(`responds with 400 when ${field} is missing`,()=>{
                delete loginAttemptBody[field]
                return supertest(app).post(`/api/auth/login`)
                    .send(loginAttemptBody)
                    .expect(400,{error:`Missing ${field} in request body`})
            })    
        })
        const array= [
            {name:'Bad username',user:{...testUser,username:`usernot`}},
            {name:'Bad password',user:{...testUser,password:`incorrect`}}
        ]
        array.forEach(obj=>{
            it(obj.name,()=>{
                return supertest(app).post(`/api/auth/login`)
                .send(obj.user)
                .expect(400,{error:`Incorrect username or password`})
            })
        })  
    })
})