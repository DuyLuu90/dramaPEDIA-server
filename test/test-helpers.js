const app= require('../src/app')
const bcrypt= require('bcryptjs')

const makeTables= {
    movies(){
        return [
            {   id: 1,
                title: 'First test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'United States',genres: ['Action'], year: 2020,
                last_modified: '2020-08-01T07:57:55.195Z',
                summary: 'test movie summary'  },
    
            {   id: 2,
                title: 'Second test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'United States',genres: ['TV Series'],year: 2020,
                last_modified: '2020-08-01T07:57:55.195Z',
                summary: 'test movie summary'  },
    
            {   id: 3,
                title: 'Third test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'Japan',genres: ['Film'], year: 2020,
                last_modified: '2020-08-01T07:57:55.195Z',
                summary: 'test movie summary' },
              
            {   id: 4,
                title: 'Fourth test movie!',
                posterurl: 'http://placehold.it/500x500',
                trailerurl: 'http://placehold.it/500x500',
                country: 'China',genres: ['Action'],year: 2020,
                last_modified: '2020-08-01T07:57:55.195Z',
                summary: 'test movie summary'   },
        ]
    },
    users(){
        return [
            {   id: 1,
                first_name:'firstName',last_name:'lastName' ,
                username:'testusername1',password: 'testPassword1' ,
                age: 18 ,country:'US',gender: 'Male' ,
                block_list: false, nickname: null,
                last_modified: '2020-08-01T07:57:55.195Z'    },
    
            {   id: 2,
                first_name:'firstName',last_name:'lastName' ,
                username:'userName2' ,password: 'testPassword2' ,
                age: 18 ,country:'JP' ,gender: 'Female' ,
                block_list: false, nickname: null,
                last_modified: '2020-08-01T07:57:55.195Z'  },
    
            {   id: 3,
                first_name:'firstName' ,last_name:'lastName' ,
                username:'userName3' ,password: 'testPassword3' ,
                age: 18 ,country:'VN' ,gender: 'Male' ,
                block_list: false, nickname: null,
                last_modified: '2020-08-01T07:57:55.195Z'   },
        ]
    },
    artists(){
        return [
            {   id: 1,  full_name: "Zen Gesner",
                "title": "Actor","avatar": "http://placehold.it/500x500",
                "birth_year": 1970,"country": "US"},
    
            {   id: 2,  full_name: "Jacqueline Collen",
                "title": "Actress","avatar": "http://placehold.it/500x500",
                "birth_year": 1968,"country": "US"},
    
            {   id: 3,  full_name: "Wolfgang Petersen",
                "title": "Director","avatar": "http://placehold.it/500x500",
                "birth_year": 1941,"country": "US" },
        ]
    },
    reviews(movies,users){
        return [
            {   id:1,
                movieid: movies[0].id,
                userid: users[0].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2020-08-01T07:57:55.195Z', },
    
            {   id:2,
                movieid: movies[1].id,
                userid: users[1].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2020-08-01T07:57:55.195Z', },
    
            {   id:3,
                movieid: movies[2].id,
                userid: users[2].id,
                comment: 'test comment',
                rating:3,upvote:3,downvote:3,
                date_submitted: '2020-08-01T07:57:55.195Z',  }
        ]
    },
    movie_cast(movies,ar){
        return [
            {id:1,movieid:movies[0].id,director:ar[0].id,actor_one:ar[1].id,actor_two:ar[2].id},
            {id:2,movieid:movies[1].id,director:ar[1].id,actor_one:ar[2].id,actor_two:ar[0].id},
            {id:3,movieid:movies[2].id,director:ar[2].id,actor_one:ar[0].id,actor_two:ar[1].id},
        ]
    }
}
const prepareTest={
    getData(){
        const testMovies= makeTables.movies()
        const testUsers= makeTables.users()
        const testArtists=makeTables.artists()
        const testReviews= makeTables.reviews(testMovies,testUsers)
        const testCasts= makeTables.movie_cast(testMovies,testArtists)
        return {testMovies,testUsers,testArtists,testReviews,testCasts}
    },
    getTestData(name){
        const {testMovies,testUsers,testArtists,testReviews,testCasts}=this.getData()
        const {newMovie,newUser,newArtist}= tools.makeNewItem()
        const {movie,artist,user}= tools.makeUpdatedItem()
        
        const array=[
            {db:"users",all: testUsers,newItem:newUser, updatedFields:user},
            {db:"artists",all: testArtists,newItem:newArtist, updatedFields:artist},
            {db:"movies",all: testMovies,newItem:newMovie, updatedFields:movie},
            {db:"reviews",all: testReviews,newItem:{},updatedFields:[]},
            {db:"movie_cast",all: testCasts,newItem:{},updatedFields:[]},
        ]
        const obj= array.find(obj=>obj.db===name) || {all:[],newItem:{},updatedFields:[]}
        const AllItems= obj.all
        const NewItem= obj.newItem
        const UpdatedFields= obj.updatedFields

        return {AllItems,NewItem,UpdatedFields}
    },
    seedTables(db,data){
        const {testMovies,testUsers,testArtists,testReviews,testCasts}= data
        return this.seedTable(db,'users',testUsers)
            .then(()=>this.seedTable(db,'artists',testArtists))
            .then(()=>this.seedTable(db,'movies',testMovies))
            .then(()=>this.seedTable(db,'movie_cast',testCasts))
            .then(()=>testReviews.length && this.seedTable(db,'reviews',testReviews))
    },
    seedTable(db,dbName,items){
        return db.into(dbName).insert(items)
            .then(()=>db.raw(
                `SELECT setval('${dbName}_id_seq',?)`,
                [items[items.length-1].id]
            ))
    },
    seedUsers(db,users){
        /*
        const preppedUsers= users.map(user=>({
            ...user,
            password: bcrypt.hashSync(user.password,1)
        }))*/
        return db.into('users').insert(users)
            .then(()=>db.raw(
                `SELECT setval('users_id_seq',?)`,
                [users[users.length-1].id], //update the auto sequence to stay in sync
            ))
    },
    cleanTables(db){
        return db.raw(
            `TRUNCATE
                reports,
                movie_cast,
                reviews,
                artists,
                movies,
                users
            RESTART idENTITY CASCADE`
        )
    }
}
const expected= {
    movieReviews(users,reviews,movieid){
        const expectedREviews= reviews.filter(review=>review.movieid===movieid)
        return expectedREviews.map(review=>{
            const reviewUser= users.find(user=>user.id===review.userid)
            return {
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                date_submitted: review.date_submitted,
                rating:3,upvote:3,downvote:3,
                'user:id' : reviewUser.id,
                'user:username': reviewUser.username,
                'user:first_name': reviewUser.first_name,
                'user:last_name': reviewUser.last_name,
            }
        })
    },
    movieCast(artists,movie_cast=[],movieid){
        const cast=movie_cast.find(cast=>cast.movieid===movieid)
        let array= [cast.actor_two,cast.actor_one]
        
        const results= array.map(id=>{
            const artist= artists.find(ar=>ar.id===id)
            return {"id": movieid,"artist:id": id,"full_name": artist.full_name}
        })
        return results   
    },
    movieDirector(artists,movie_cast=[],movieid){
        const cast=movie_cast.find(cast=>cast.movieid===movieid)
        let array= [cast.director]
        
        const results= array.map(id=>{
            const artist= artists.find(ar=>ar.id===id)
            return {"id": movieid,"artist:id": id,"full_name": artist.full_name}
        })
        return results   
    },
    
}
const tools={
    makeFetchRequests(endpoint,valid,invalid){
        const token= `Basic ${process.env.API_TOKEN}`
        const get= supertest(app).get(`/api/${endpoint}`).set('Authorization',token)
        const post= supertest(app).post(`/api/${endpoint}`).set('Authorization',token)
        const invalidFetch=[
            {GET: supertest(app).get(`/api/${endpoint}/${invalid}`).set('Authorization',token)},
            {DELETE: supertest(app).delete(`/api/${endpoint}/${invalid}`).set('Authorization',token)},
            {PATCH: supertest(app).patch(`/api/${endpoint}/${invalid}`).set('Authorization',token)}
        ]
        const validFetch={
            GET: supertest(app).get(`/api/${endpoint}/${valid}`).set('Authorization',token),
            DELETE: supertest(app).delete(`/api/${endpoint}/${valid}`).set('Authorization',token),
            PATCH: supertest(app).patch(`/api/${endpoint}/${valid}`).set('Authorization',token)
        }

        return {get,post,invalidFetch,validFetch}
    },
    calculateAvgReviewRating(reviews){
        if(!reviews.length) return 0
        const sum= reviews.map(review=>review.rating).reduce((a,b)=>a+b)
        return Math.round(sum/reviews.length)
    },
    makeAuthHeader(user){
        const token = Buffer.from(`${user.user_name}:${user.password}`).toString(`base64`)
        return `Bearer ${token}`
    },
    makeNewItem(){
        const newMovie= {
            "title": "New test movie",
            "posterurl": "http://placehold.it/500x500",
            "trailerurl": "http://placehold.it/500x500",
            "country": "Japan","genres": ["Test"], "year": 2020, 
            "summary": "test movie summary" 
        }
        const newUser= {
            "first_name": "Alex", "last_name": "Wang", 
            "username": "aw1990", "password": "11AAaa!!",
            "age": 18, "country": "CN", "gender": "Male"
        }
        const newArtist= {
            "full_name": "New Actor",
            "title": "Actor","avatar": "http://placehold.it/500x500",
            "birth_year": 1970,"country": "US"
        }
        return {newMovie,newUser,newArtist}
    },
    makeUpdatedItem(){
        const movie=[
            {"Update_movie":{ "title": "Updated title", "posterurl": "http://newposter.com"}}
        ]
        const artist=[
            {"Update_artist":{"full_name": "Updated Name","country": "HK"}}
        ]
        const user=[
            {"With_password":{"password": "newP@ssword123"}},
            //{"Without_password":{"username": "newUserName"}}
        ]
        return {movie,artist,user}
    },
    hashPassword(password){
        return bcrypt.hash(password,12)
    },
}


module.exports= {makeTables,prepareTest,expected,tools}