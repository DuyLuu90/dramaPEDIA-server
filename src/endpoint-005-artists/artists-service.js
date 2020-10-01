const ArtistService = {
    getMovieByArtist(db,artistId){
        return db.from(`movie_cast AS cast`)
        .select('cast.movieid','movies.title','movies.year')
        .where('cast.director',artistId)
        .orWhere('cast.actor_one',artistId)
        .orWhere('cast.actor_two',artistId)
        .join('movies','cast.movieid','movies.id')
        .orderBy('movies.year','desc')
    },
}

module.exports= ArtistService