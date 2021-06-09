/*
 * This function takes in the Github URL and breaks it down.
 * @param {string} githubUrl This is the url parameter passed in the API url.
 * @return {dictionary} dict If parameter is correct, it contains two keys, user and repo, otherwise it  is empty
 */
exports.splitUrl = (githubUrl) => {
    let urlArr = githubUrl.split('/')
    var dict = {};
    //Validates based on urls of type https://github.com/<user>/<repo> or https://github.com/<user>/<repo>/ (notice the slash)
    if(urlArr.length === 5 || (urlArr.length === 6 && urlArr[5] === '')) {
        dict.user = urlArr[3];
        dict.repo = urlArr[4];
        return dict
    }
    return dict
}