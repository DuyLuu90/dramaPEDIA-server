# Dramapedia

This is my first full stack capstone, as a junior Developer, to demonstrate my mastery of React, Node and PostgresSQL, . For this capstone, I built both the client and the API to support the app. To learn more about my app features, please read [HERE](https://github.com/DuyLuu90/First-Capstone-Client/blob/master/README.md)

## Built with:
* Node JS
* Javascript
* PostgreSQL (Relational DBMS), DBeaver(GUI client)

**Resources**:
* [SQL Syntax](https://www.w3schools.com/sql/sql_syntax.asp)

## Set up

Complete the steps [HERE](https://github.com/DuyLuu90/express-boilerplate/edit/master/README.md) to start your new project.

To read my notes for express, PostgreSQL and more, please click [here](https://github.com/DuyLuu90/express-boilerplate/master/md/Notes.md)

## Installed packages:
* express (top-level function), morgan(logging),dotenv(to populate the process.env)
* cors(add header of CORS to the req),helmet(hide response headers)
* uuid(auto-generate a unique id),winston(logging library),xss(sanitizing tool
* knex(SQL query builder library), pq(driver for Postgres)
* bcryptjs (for hashing data), jsonwebtoken(to represent user's credentials)

**For development only:**

* nodemon(auto restart)
* mocha(testing framework), chai(assertion library), supertest(for http calls)
* postgrator-cli (to use migrations for PostgresSQL)

## Code structure/Best practices/Style/Security:
**Modularing (aka horizontally organizing) and layering**
* endpoint : router(`express.Router`) and its customized services
* middleware
* service
* test

**Don't repeat yourself(DRY)**
- `src/service/api-service.js`: general services used by all routers
- `src/test/endpoint.ALL.spec.js`: tests are used by all endpoints

**Encapsulation**
* Customized service for each endpoint

**Separation of concerns**
- `src/middleware/general-validation.js`: check items if they exist
- `src/middleware/form-validation.js`: check user input
- `src/middleware/require-auth.js`: check user authorization and authentication 

**Architecture Style**:
REST(Representation State Transfer):
  - clear SOC (client:UI, server: data storage)
  - statelessness (server has no session)
  - predictable responses (create profile pages)
  - uniform interface ( get resources from the server->update the state)
  
**Security**:
- Authorization: API token is required to get access to the db
- Authentication: user must log in with valid username/password to make any changes to the db.
- Data protection: Bcrypt is used to pseudonymise the passwords stored in the db
- Secure login: JWT is used to represent user credentials. 

## Learn More

[Live version](https://first-capstone-client.vercel.app/)

[API Server](https://secure-caverns-32891.herokuapp.com/)

[Github Client](https://github.com/DuyLuu90/First-Capstone-Client)

## Connect:

[LinkedIn](https://www.linkedin.com/in/duy-luu-82234232/)
