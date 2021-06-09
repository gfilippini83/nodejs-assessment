const helpers = require('../utils/helper.utils')
/*
 * This function checks to make sure that the user and repo parameters do not contain special characters.
 */
exports.validate = async (req, res, next) => {
    //Getting the user and repo from the Github URL
    const dict = helpers.splitUrl(req.query.githubUrl)

    //Making sure that the user and repo are set, otherwise there was an error with the URL
    if(Object.keys(dict).includes('user') && Object.keys(dict).includes('repo')) {

        //Establishing a pattern of characters that the user or repo should not contain
        var pattern = new RegExp(/[~`!#$%\^&*+=\[\]\\';,/{}()|\\":<>\?]/);
        if(!pattern.test(dict.user) && !pattern.test(dict.repo)) {
            res.locals.user = dict.user
            res.locals.repo = dict.repo
            next();
        } else {
            return res.status(400).json({status: 400, message: "Please make sure the parameters in the url do not contain special characters."});
        }
    } else {
        return res.status(400).json({status: 400, message: "Please make sure the github url is correctly formatted, https://github.com/<user>/<repo>"});
    }
}