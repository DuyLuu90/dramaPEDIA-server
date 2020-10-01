const knex= require('knex')
const helpers= require('./test-helpers')
const app= require('../src/app')

/*

describe('AUTHENTICATION AND AUTHORIZATION',()=>{
    const testUsers= helpers.makeUsersArray()
    const testUser= testUsers[0]
    let db;
    before('makeAuthHeader knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => helpers.cleanTables(db))
    afterEach('cleanup', () => helpers.cleanTables(db))

    describe('Protected endpoints',()=>{
      const protectedEndpoints = [
        //{name:`GET /api/movies/:movieId`,method:supertest(app).get,path:`/api/movies/1`},
        //{name:`GET /api/movies/:movieIid/reviews `,method:supertest(app).get,path:`/api/movies/1/reviews`},
        {name:`POST /api/reviews/:reviewId`,method:supertest(app).post,path:`/api/reviews/:reviewId`},
        {name:`POST /api/reviews`,method:supertest(app).post,path:`/api/reviews`},
      ]
      protectedEndpoints.forEach(endpoint=>{
      describe(endpoint.name,()=>{
        beforeEach(()=>{
          //db.into('movieful').insert(testmovies)
          helpers.seedUsers(db,testUsers)
        })
        it(`respond 401 when no bearer token`,()=>{
          return endpoint.method(endpoint.path)
          .expect(401,{error:`Missing bearer token`})
        })
        it(`respond 401 when invalid JWT secret`,()=>{
          //const userNoCreds={user_name:'',password:''}
          const validUser= testUsers[0]
          const invalidSecret='bad-secret'
          return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser,invalidSecret))
          .expect(401,{error:`Unauthorized request`});
        })
        it(`respond 401 when invalid sub in payload`,()=>{
          const invalidUser= {user_name:`user-not-existy`, id:1}
          return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401,{error:`Unauthorized request`});
        })
          /*
          it(`respond 401 when invalid password`,()=>{
            const userInvalidPass= {user_name:testUsers[0].user_name, password: `wrong`}
            return endpoint.method(endpoint.path)
            .set('Authorization', helpers.makeAuthHeader(userInvalidPass))
            .expect(401,{error:`Unauthorized request`});
          })
      }) })
  })

    describe('Auth Endpoint',()=>{
      describe(`POST api/auth/login`,()=>{
        beforeEach('Insert users',()=>{
          helpers.seedUsers(db,testUsers)
        })
        
      })
    })

    
})*/