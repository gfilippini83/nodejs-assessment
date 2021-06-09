let express = require('express');
let logger = require('morgan');
let cors = require('cors');

//Importing router for API
let githubRouter = require('./server/routes/github.routes');

let app = express();

//Setting up the express server to use node modules and router
app.use(logger('dev'))
   .use(cors())
   .use(express.json())
   .use(express.urlencoded({extended: true}))
   .use('/api/v1', githubRouter);

//Setting port to 3000 unless otherwise specified in environment variables
const port = process.env.PORT || 3000;

/*
 * This function will make the express server listen on http protocol.
 */
function startServer() {
    app.angularFullStack = app.listen(port, '0.0.0.0', function () {
        console.log("Backend is listening on 0.0.0.0 and port %d", port);
    })
}

//Calls the startServer function upon initial run
setImmediate(startServer);

module.exports = app;