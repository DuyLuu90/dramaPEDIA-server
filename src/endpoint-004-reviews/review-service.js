const ReviewService = {
  getReviewsByMovie(db,movieid){
    return db
        .from('reviews AS rev')
        .select('rev.id','rev.rating','rev.comment','rev.date_submitted','rev.upvote','rev.downvote',
            ...userFields,
        )
        .where('rev.movieid',movieid)
        .leftJoin('users AS usr','rev.userid','usr.id',)
        .groupBy('rev.id', 'usr.id')

  },
  getReviewsByUser(db,userid){
    return db('reviews AS rev')
        .select('rev.id','rev.rating','rev.comment','rev.date_submitted','rev.upvote','rev.downvote',
            ...movieFields
        )
        .where({userid})
        .leftJoin('movies AS mov','rev.movieid','mov.id')
  }
/*
  getById(db, id) {
    return db
      .from('reviews AS rev')
      .select('rev.id','rev.rating','rev.comment','rev.date_submitted','rev.movieid',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.username,
                usr.first_name,
                usr.last_name
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin('users AS usr','rev.userid','usr.id',)
      .where('rev.id', id)
      .first()
  },
  */
}
const userFields = [
  'usr.id AS user:id',
  'usr.username AS user:username',
  'usr.first_name AS user:first_name',
  'usr.last_name AS user:last_name',
]
const movieFields=[
  'mov.id AS movie:id',
  'mov.title AS movie:title'
]

module.exports = ReviewService
