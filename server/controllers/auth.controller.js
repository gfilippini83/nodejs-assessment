/*
 * The auth function currently does not handle any type of authorization, but this is an example on how I would write a middleware to handle authorization
 */
exports.auth = async (req, res, next) => {
    //Would do API call to make sure the user is authenticated and set it to authorized
    let authorized = true;
    if(authorized) {
        next();
    } else {
        return res.status(401).json({status: 401, message: "Unauthorized to access API"});
    }
} 