//const express= require('express')
const {GeneralService,express,path,bodyParser}= require('../route-helpers')
const ArtistRouter= express.Router()

//SERVICE:
const ArtistService= require('./artists-service')

//MIDDLEWARE:
const {requireBasicAuth}= require('../middleware/require-auth')
const {checkItemExists}= require('../middleware/general-validation')

ArtistRouter.route('/')
.all(requireBasicAuth)
.get((req,res,next)=>{
    GeneralService.getAllItems(req.app.get('db'),'artists')
        .then(artists=>{
            return res.status(200).json(artists)
        })
        .catch(next)
})
.post(bodyParser,(req,res,next)=>{
    const {full_name,title,avatar,birth_year,country}= req.body
    const newArtist= {full_name,title,avatar,birth_year,country}
    GeneralService.insertItem(req.app.get('db'),'artists',newArtist)
        .then(ar=>{
            res.status(201).location(path.posix.join(req.originalUrl,`/${ar.id}`))
            .json(ar)
        })
        .catch(next)
    
})

ArtistRouter.route('/:id')
.all(requireBasicAuth)
.all((req,res,next)=>checkItemExists(req,res,next,'artists'))
.get((req,res)=>{
    res.json(res.item)
})
.delete((req,res,next)=>{
    GeneralService.deleteItem(req.app.get('db'),'artists',req.params.id)
    .then(()=>res.status(200).json('The artist has been deleted'))
    .catch(next)
})
.patch(bodyParser,(req,res,next)=>{
    const {full_name,title,avatar,birth_year,country}= req.body
    const ArtistUpdate= {full_name,title,avatar,birth_year,country}
    GeneralService.updateItem(req.app.get('db'),'artists',req.params.id,ArtistUpdate)
    .then(()=>res.status(200).json('req sent successfully'))
    .catch(next)
})

ArtistRouter.route('/:id/movies')
.all(requireBasicAuth)
.all((req,res,next)=>checkItemExists(req,res,next,'artists'))
.get((req,res,next)=>{
    ArtistService.getMovieByArtist(req.app.get('db'),req.params.id)
    .then(movies=>res.json(movies))
    .catch(next)
})

module.exports= ArtistRouter