let axios = require('axios');

//Setting the config so we can use the headers for each of the axios calls
let config = {
    headers: {
        Authorization: (process.env.TOKEN) ? `token ${process.env.TOKEN}` : null,
        Accept: 'application/vnd.github.v3+json'
    }
};

/*
 * This function gets the repo data using the user and repo name parameters passed in the API call. We
 * then call the github API to 
 */
exports.getRepoData = async (req, res, next) => {
    //Obtaining the parameters from the url
    const user = res.locals.user;
    const repo = res.locals.repo;

    //Generating the url for the API call to the github api
    const urlBase = `https://api.github.com/repos/${user}/${repo}`;

    //Retreiving the data using axios, uses errorHandler function if there is a request error with axios
    let data = await axios.get(urlBase, config).catch(errorHandler)
    var exact = false;

    //Setting the exact variable, so we can manipulate the payload based on the request
    if(req.url.includes('/exactRequest')) {
        exact = true
    }

    if(data.status === 200) {
        //Setting local variables to be accessed in later middleware function calls
        res.locals.urlBase = urlBase;
        res.locals.exact = exact;

        res.locals.result = (!exact) ? 
                //If the addtionalInfo route is accessed
                {
                    name: data.data.name, 
                    description: data.data.description, 
                    owner: {
                        name: data.data.owner.login, 
                        linkToUser: data.data.owner.html_url
                    }, 
                    linkToRepo: data.data.html_url
                } 
            :
                //If the exactRequest route is accessed
                {}
        ;
        
        //Sending to the next middleware
        next();
    } else {
        //If there has been an error, we can send the error status and message to the user
        return res.status(data.status).json({status: data.status, message: data.message});
    }
};

/*
 * In this function, we access the pull request data, and return the resulting object, res.locals.result
 */
exports.getPulls = async (req, res) => {
    //Getting the pull request data from the Github API
    let pullRequestData = await axios.get(`${res.locals.urlBase}/pulls`, config);

    //Setting the number of pull requests in the response object
    res.locals.result.numOpenPullRequests = pullRequestData.data.length;

    //Cleaning the data to be sent back to the user
    const cleanedData = await cleanPullRequestData(pullRequestData, res.locals.exact);

    //returning the data
    res.locals.result.openPullRequests = cleanedData;
    return res.status(200).json({status: 200, data: res.locals.result});
};

/*
 * This is a helper function which is why it is not exported. This function is accessed in the getPulls
 * function and itereates through the pull requests and stores the corresponding data into an object 
 * which is then pushed into an array.
 * @param {Array<Object>} pullRequestData This is an array of objects where the objects are the pull requests retrieved using the Github API
 * @return {Array<Object>} openedPullRequests Returns an array of objects where the objects are the pull requests but only containing a specified amount of data.
 */
async function cleanPullRequestData(pullRequestData, exact) {
    var openedPullRequests = [];
    //Iterate each of the indices which represents the pull requests in the array
    for(var prIndex = 0; prIndex < pullRequestData.data.length; prIndex++) {
        //We need to get the url from each PR in the array and then get the full data for the PR using the url
        var tempPr = pullRequestData.data[prIndex];

        //Getting all the data for the PR and setting the data to itself
        var pullRequest = await axios.get(tempPr.url, config)
        pullRequest = pullRequest.data
       
        //Setting the the temporary object that contains all the data for the Pull Request
        var tempPrData = {};
        tempPrData.prCreator = pullRequest.user.login;
        tempPrData.totalNumberOfComments = (pullRequest.comments + pullRequest.review_comments);
        tempPrData.numberOfCommits = pullRequest.commits;
        
        //There is an additional route that will include this data if the user wants additional information on the pull request and repo
        if(!exact) {
            tempPrData.title = pullRequest.title;
            tempPrData.number = pullRequest.number;
            tempPrData.created_at = pullRequest.created_at;
            tempPrData.updated_at = pullRequest.updated_at;
            tempPrData.url = pullRequest.html_url;
            tempPrData.baseBranch = pullRequest.base.label;
            tempPrData.headBranch = pullRequest.head.label;
        }

        //Pushing each of the Pull request objects to the array which will be sent to the user in the response object
        openedPullRequests.push(tempPrData);

    }
    return openedPullRequests;
}

/*
 * This is the errorHandler which is triggered in the event that the initial request to the Gihub API
 * is not valid. This will construct an object containing a status code and message that will be returned 
 * and then sent to the user.
 * @param {Object} err This is the error received from axios.
 * @return {Object} parsedError An object that contains status and message pertaining to the error.  
 */
function errorHandler(err) {
    //By default the error is set for service unreachable
    var parsedError = {status: 503, message: 'No Response from github API'};
    if(err && err.response.status && err.response.data.message) {
        //Set the error from the Github API response
        parsedError = {status: err.response.status, message: `Error from Github API: ${err.response.data.message}`};
        return parsedError;
    }
    if(err && err.response.status) {
        //Set the error even if there is no message associated with the error status
        parsedError = {status: err.response.status, message: 'No message sent from github API'};
        return parsedError;
    }
    return parsedError;
}