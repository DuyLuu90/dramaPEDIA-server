require('dotenv').config();

module.exports = {
    "migrationDirectory": "migrations",
    "driver": "pg",
    "connectionString": (process.env.NODE_ENV === 'test')
        ? process.env.TEST_DATABASE_URL
        : 'postgres://ghpcgzjuxqymig:57b106eafbfb03708350e21605b21665b822779802fd8be911aca6abd39091b6@ec2-54-90-68-208.compute-1.amazonaws.com:5432/d41crvol1umhm',
    "ssl": true
}