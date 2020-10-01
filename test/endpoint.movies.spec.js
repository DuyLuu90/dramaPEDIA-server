const knex= require('knex')
const app= require('../src/app')

const {prepareTest,expected} = require('./test-helpers')

//SUMMARY= {Number-of-tests: 7 ,Passed: 7, Failed:0 , Skipped: 0} 

describe.only('MOVIE ENDPOINT',()=>{
    const {testMovies,testUsers,testArtists,testReviews,testCasts}= prepareTest.getData()
    const data= {testMovies,testUsers,testArtists,testReviews,testCasts}
    
    let db;
    before('makeAuthHeader knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
    
    after('disconnect from db', () => db.destroy())
    before('cleanup', () => prepareTest.cleanTables(db))
    afterEach('cleanup', () => prepareTest.cleanTables(db))

    describe('/api/movies/:movieId',()=>{
        beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
        const validId= 2
        
        it('GET movie review',()=>{
            const expectedReviews= expected.movieReviews(testUsers,testReviews,validId)
            return supertest(app).get(`/api/movies/${validId}/reviews`)
            .set('Authorization',`Basic ${process.env.API_TOKEN}`)
            .expect(200,expectedReviews)
        })

        it('GET movie cast',()=>{
            const expectedCast=expected.movieCast(testArtists,testCasts,validId)
            return supertest(app).get(`/api/movies/${validId}/cast`)
            .set('Authorization',`Basic ${process.env.API_TOKEN}`)
            .expect(200,expectedCast)
        })

        it('GET movie director',()=>{
            const expectedCast=expected.movieDirector(testArtists,testCasts,validId)
            return supertest(app).get(`/api/movies/${validId}/director`)
            .set('Authorization',`Basic ${process.env.API_TOKEN}`)
            .expect(200,expectedCast)
        })
    })

    describe('SORT MOVIES',()=>{
        beforeEach('Insert movies',()=>prepareTest.seedTables(db,data))
        const genres= {path:'/api/movies?genres',name:'Sort by invalid genres'}
        const country={path:'/api/movies?country',name:'Sort by invalid country'}
        
        context('Given sort is invalid',()=>{
            [genres,country].forEach(sort=>{
                it(sort.name,()=>{
                    return supertest(app).get(`${sort.path}=invalid`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(404,{error:{
                        message:`Movie not found`
                    }})
                })
            })
        })
        context('Given sort is valid',()=>{
            it('Sort by genres',()=>{
                const validGenres= 'Film'
                const MovieList= testMovies.filter(movie=>movie.genres.includes(validGenres))
                return supertest(app).get(`${genres.path}=${validGenres}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(200,MovieList)
            })
            it('Sort by country',()=>{
                const validCountry= 'United States' 
                const MovieList= testMovies.filter(movie=>movie.country===validCountry)
                return supertest(app).get(`${country.path}=${validCountry}`)
                    .set('Authorization',`Basic ${process.env.API_TOKEN}`)
                    .expect(200,MovieList)
            })
        })
    })
    
})