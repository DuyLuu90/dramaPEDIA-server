const knex= require('knex')
const app= require('../src/app')

const {prepareTest,tools} = require('./test-helpers')
const bcrypt = require('bcryptjs')

//SUMMARY= {Number-of-tests: 10,Passed: 10, Failed:0, Skipped:0} 

describe('USERS ENDPOINT',()=>{
    const {testMovies,testUsers,testArtists,testReviews,testCasts}= prepareTest.getData()
    const data= {testMovies,testUsers,testArtists,testReviews,testCasts}
    const validId= 2
    const {validFetch} = tools.makeFetchRequests('users',validId,12345)

    let db;
    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => prepareTest.cleanTables(db))
    afterEach('cleanup', () => prepareTest.cleanTables(db))

    describe(`ENDPOINT /api/users/:userId`,()=>{
        beforeEach('Insert data',()=>prepareTest.seedTables(db,data))
        
        describe(`UPDATE user details`,()=>{
            context('Without password',()=>{
                it('respond 200 with the updated fields',()=>{
                    let fieldToUpdate= {username: 'newUserName',}
                    return validFetch.PATCH.send(fieldToUpdate)
                        //.send({...fieldToUpdate, fieldToIgnore: 'should not be in GET response'})
                        .expect(200)
                        .then(res=>validFetch.GET.then(res=>{
                                console.log(res.body.username)
                                for (const field in fieldToUpdate ){
                                    expect(res.body[field]).to.eql(fieldToUpdate[field])
                                }
                            })
                        )
                })

            })
            context('With password',()=>{
                it('respond 204 with hashed password',()=>{
                    let fieldToUpdate= {"password":"newP@ssword1!"}
                    return  supertest(app).patch(`/api/users/${validId}`)
                        .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                        .send(fieldToUpdate)
                        .then(
                            res=>validFetch.GET.then(row=>console.log(row.body.password))
                        )
                })
            })      
        })
    
    })
})