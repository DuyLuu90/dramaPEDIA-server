//const express= require('express')
const {GeneralService,express,path,xss,bodyParser,isWebUrl}= require('../route-helpers')
const MovieRouter= express.Router()

//SERVICE:
const MovieService= require('./movies-service')

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {movieValidation}= require('../middleware/form-validation')
const {checkItemExists}= require('../middleware/general-validation')
const { json } = require('express')

const sanitizedMovie = movie =>{
    const newMovie= {...movie, title: xss(movie.title), summary: xss(movie.summary), year: Number(movie.year)}
    return newMovie
}

MovieRouter.route('/')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        const {country,genres}= req.query
        if (genres) {
            MovieService.getMovieByGenres(req.app.get('db'),genres)
            .then(movies=>{
                if(movies.length===0) {
                    return res.status(404).json({error:{message:`Movie not found`}})
                }
                res.status(200).json(movies)
            }).catch(next)
        }
        else if(country) {
            MovieService.getMovieByCountry(req.app.get('db'),country)
            .then(movies=>{
                if(movies.length===0) {
                    return res.status(404).json({error:{message:`Movie not found`}})
                }
                res.status(200).json(movies)
            }).catch(next)
        }
        else GeneralService.getAllItems(req.app.get('db'),'movies')
            .then(movies=>{
                return res.status(200).json(movies)
            }).catch(next)  
    })
    .post(bodyParser,(req,res,next)=>{
        const errorMessage= movieValidation(req,res,next)
        if(errorMessage) {
            return res.status(400).json({error: errorMessage})
        }
        const {title,posterurl,trailerurl,summary,year,country,genres,published}= req.body
        const newMovie= {title,posterurl,trailerurl,summary,year,country,genres,published}
        GeneralService.insertItem(req.app.get('db'),'movies',newMovie)
            .then(movie=>{
                res.status(201).location(path.posix.join(req.originalUrl,`/${movie.id}`))
                .json(sanitizedMovie(movie))
            })
            .catch(next)
        
    })
MovieRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        //res.json(sanitizedMovie(res.item))
        MovieService.getMovieById(req.app.get('db'),req.params.id)
            .then(movie=>res.json(movie)).catch(next)
    })
    .delete((req,res,next)=>{
        const {id}=req.params
        GeneralService.deleteItem(req.app.get('db'),'movies',id)
        .then(()=>res.status(200).json('Movie has been deleted'))
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const{title,published,posterurl,trailerurl,summary,year,country,genres}= req.body
        const movieToUpdate= {title,published,posterurl,trailerurl,summary,year,country,genres}
        const knex= req.app.get('db')

        const numberofValues= Object.values(movieToUpdate).filter(Boolean).length
        if(numberofValues===0) {
            return res.status(400).json({error:{
                message: `Req body does not contain any field to update`
            }})
        }
        GeneralService.updateItem(knex,'movies',req.params.id, movieToUpdate)
        .then(()=>res.status(200).json('req sent successfully'))
        .catch(next)
    })

MovieRouter.route('/:id/cast')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .post(bodyParser,(req,res,next)=>{
        const {movieid,director,actor_one,actor_two}= req.body
        const newCast= {movieid,director,actor_one,actor_two}
        GeneralService.insertItem(req.app.get('db'),'movie_cast',newCast)
            .then(cast=>json(cast))
            .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {director,actor_one,actor_two}= req.body
        const updatedCast= {director,actor_one,actor_two}
        MovieService.updateMovieCast(req.app.get('db'),req.params.id,updatedCast)
            .then(()=>res.status(200).json('req sent successfully'))
            .catch(next)
    })

MovieRouter.route('/:id/reviews')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'movies'))
    .get((req,res,next)=>{
        MovieService.getReviewsForMovie(req.app.get('db'),req.params.id)
        .then(reviews=>res.status(200).json(reviews))
        .catch(next)
    })

module.exports= MovieRouter


