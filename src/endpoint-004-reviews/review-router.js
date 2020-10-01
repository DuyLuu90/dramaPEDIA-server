const {GeneralService,express,path,xss,bodyParser}= require('../route-helpers')
const ReviewService= require('./review-service')
const ReviewRouter= express.Router()

//MIDDLEWARE
const {requireBasicAuth}= require('../middleware/require-auth')
const {checkItemExists,sanitizeItem}= require('../middleware/general-validation')

ReviewRouter.route('/')
    .all(requireBasicAuth)
    .get((req,res,next)=>{
        const {userid,movieid}= req.query
        if (movieid){
            ReviewService.getReviewsByMovie(req.app.get('db'),movieid)
            .then(reviews=>res.status(200).json(reviews)).catch(next)
        }
        else if (userid){
            ReviewService.getReviewsByUser(req.app.get('db'),userid)
            .then(reviews=>res.status(200).json(reviews)).catch(next)  
        }
        else GeneralService.getAllItems(req.app.get('db'),'reviews')
            .then(reviews=>res.status(200).json(reviews)).catch(next)
    })
    .post(bodyParser,(req,res,next)=>{
        //res.header('Access-Control-Allow-Origin','*')
        const {movieid,comment,userid,rating}= req.body
        const newReview= {movieid,comment,userid,rating}
        const data= sanitizeItem(newReview,['comment'])
        GeneralService.insertItem(req.app.get('db'),'reviews',data)
            .then(review=>{
                res.status(201)
                .location(path.posix.join(req.originalUrl,`/${review.id}`))
                .json(review) 
            }).catch(next)
            //.catch(err=>console.log(err))
            //.catch(next) //500 on heroku  
    })

ReviewRouter.route('/:id')
    .all(requireBasicAuth)
    .all((req,res,next)=>checkItemExists(req,res,next,'reviews'))
    .get((req,res,next)=>{
        res.json(res.item)
    })
    .delete((req,res,next)=>{
        GeneralService.deleteItem(req.app.get('db'),'reviews',req.params.id)
        .then(()=>res.status(200).json('Review has been deleted'))
        .catch(next)
    })
    .patch(bodyParser,(req,res,next)=>{
        const {comment,rating,upvote,downvote}= req.body
        const updatedReview= {comment,rating,upvote,downvote}
        for (const key of ['comment','rating','upvote','downvote']){
            if (updatedReview[key]==='') delete updatedReview[key]
        }
        GeneralService.updateItem(req.app.get('db'),'reviews',req.params.id,updatedReview)
            .then(()=>res.status(200).json('req sent successfully'))
            .catch(next)
    })

module.exports= ReviewRouter