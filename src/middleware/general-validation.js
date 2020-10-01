const {GeneralService}= require('../route-helpers')

async function checkItemExists(req, res, next,dbName) {
    try {
        const item = await GeneralService.getItemById(req.app.get('db'),dbName,req.params.id)
        if (!item) {
        return res.status(200).json({error: {message: `Requested item doesn't exist`}})
        }
        res.item = item
        next()
    } catch (error) {
        next(error)
    }
}

function sanitizeItem(item, keys=[]){
    for (const key of keys) {
        item[key]= xss(item[key])
    }
    return item
}

function checkRequiredFields(req, fields=[]){
    for (const field of fields) {
        if(!req.body[field]) {
            return `${field} is required`
        }
    }
}

module.exports= {checkItemExists,sanitizeItem, checkRequiredFields}