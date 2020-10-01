const MovieService = {
    getMovieByGenres(db,genres){
        return db('movies').select('*').then(movies=>{
            return movies.filter(movie=>movie.genres.includes(genres))
        })   
    },
    getMovieByCountry(db,country){
        return db('movies').select('*').where('movies.country',country)
        .orderBy('movies.year','desc')
    },
    updateMovieCast(db,movieid,fieldsToUpdate){
        return db.from('movie_cast').where({movieid})
            .then(()=>db('movie_cast').where({movieid}).update(fieldsToUpdate))
            .catch(()=>{
                const data= {...fieldsToUpdate, movieid:movieid}
                return db.insert(data).into('movie_cast').returning('*').then(rows=>rows[0])
            })
    },
    getReviewsForMovie(db,movieid){
        return db
        .from('reviews AS rev')
        .select('rev.id','rev.rating','rev.comment','rev.date_submitted','rev.upvote','rev.downvote',
            ...userFields,
        )
        .where('rev.movieid',movieid)
        .leftJoin('users AS usr','rev.userid','usr.id',)
        .groupBy('rev.id', 'usr.id')
    },
    getArtistName(db,id1,id2,id3){
        return db('artists').where('artists.id',id1)
        .orWhere('artists.id',id2)
        .orWhere('artists.id',id3)
        
    },
    getMovieById(db,movieid){
       return db('movies AS mov').select(movieFields).where('mov.id',movieid).first()
        .leftJoin('movie_cast AS cast','cast.movieid','mov.id')
        .select('cast.director','cast.actor_one','cast.actor_two')
        .then(function(movie){
            const {director,actor_one,actor_two}= movie
            movie.actorList=[]
            movie.directorList=[]
            return MovieService.getArtistName(db,director,actor_one,actor_two).then(arr=>{
                arr.map(obj=>{
                    if (obj.id===director) movie.directorList.push({id:obj.id,name:obj.full_name})
                    if (obj.id===actor_one || obj.id===actor_two) movie.actorList.push({id:obj.id,name:obj.full_name})  
                })
                for ( const key of ["director","actor_one","actor_two"]){
                    delete movie[key]
                }
                return movie   
            })
        })
        
    }
}
const movieFields=[
    'mov.id',
    'mov.title',
    'mov.posterurl',
    'mov.trailerurl',
    'mov.summary',
    'mov.year',
    'mov.country',
    'mov.genres',
    'mov.last_modified',
    'mov.published'
]
const userFields = [
    'usr.id AS user:id',
    'usr.username AS user:username',
    'usr.first_name AS user:first_name',
    'usr.last_name AS user:last_name',
]

module.exports= MovieService