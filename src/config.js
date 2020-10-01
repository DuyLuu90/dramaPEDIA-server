module.exports= {
    PORT: process.env.PORT || 8001,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    DATABASE_URL: (process.env.NODE_ENV==='production')
                ? process.env.DATABASE_URL 
                : process.env.LOCAL_DATABASE_URL,
       
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL,

    API_TOKEN: process.env.API_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET ,
    JWT_EXPIRY: '24h'
}

