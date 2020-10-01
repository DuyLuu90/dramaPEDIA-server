const express = require('express')
const path= require('path')
const xss= require('xss')
const bodyParser= express.json()
const {isWebUrl}= require('valid-url')

const GeneralService={
    getAllItems(db,dbName){
        return db(dbName).select('*')
    },
    getItemById(db,dbName,id){
        return db(dbName).where({id}).first()
    },
    insertItem(db,dbName,newItem){
        return db.insert(newItem).into(dbName)
            .returning('*').then(rows=>rows[0])
    },
    deleteItem(db,dbName,id){
        return db(dbName).where({id}).delete()
    },
    updateItem(db,dbName,id,fieldsToUpdate){
        return db(dbName).where({id}).update(fieldsToUpdate)
    }
}

module.exports={GeneralService,express,path,xss,bodyParser,isWebUrl}