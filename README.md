STEPS TO RUN:

1. Delete the node_modules and package-lock.json to ensure fresh install of node packages
2. Execute `npm i` in this directory
3. Ensure that you have nodemon installed globally `npm i -g nodemon`
4. Execute `npm start`


STEPS TO TEST CODE:

1. Once the API is running, access: `http://localhost:3000/api/v1/exactRequest?githubUrl=https://github.com/<user>/<repo>` (please remember to use the githubUrl param)
2. Test with valid and invalid repos.


NOTES:


I've added a `.gitignore` to not track the node_modules and package-lock.json files because this 
is how I would store this as a repo in github.


I have also added an additional route, `http://localhost:3000/api/v1/additionalInfo?githubUrl=https://github.com/<user>/<repo>`. This will 
provide a bit more information on the repository and each of the Pull Requests. The fields for this route are as follows:


    status: The status code for the API call

    data: Object containing the response data for the user and repo.

        name: Name of the repo

        description: Description for the repo

        owner: Object containing information on the repo owner

            name: Owner of the repo's name

            linkToUser: Link to the owners Github profile

        linkToRepo: Link to the repo

        numOpenPullRequests: The number of Pull Requests

        openPullRequests: Array of Objects that represent the pull requests open for that repo

            prCreator: Creator of the pull request

            totalNumberOfComments: The number of comments on the pull request

            numberOfCommits: The number of commits in the pull request

            title: Title of the pull request

            number: The number of the pull request, this is auto incremented by Github

            create_at: The creation timestamp for the pull request

            updated_at: The last update timestamp for the pull request

            url: URL to the pull request

            baseBranch: This is the branch that the PR is created to merge into

            headBranch: This is the branch with the changes to be merged into baseBranch
        

I included some basic auth controller to show how I would go about including authorization into this microservice
as well as a middleware function to validate that there are no special characters in the user or repo parameters.


Lastly, I included an environment variable call in the github controller to set the authentication token, TOKEN. This is to increase the rate limit 
for the Github API. The mircoservice will work if you do or do not set this variable, but you may reach the rate limit quicker if you do not set the environment 
variable. You can create an Personal Access Token with the following link: https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token. 
Similarly, you can specify the PORT variable if you would like to use something other than 3000.


EXAMPLES:

    token: `ghp_xxxxxx`
    
    windows: In cmd: `set TOKEN=<insert token here>`
    
    mac: In Terminal `export TOKEN=<insert token here>`
    
