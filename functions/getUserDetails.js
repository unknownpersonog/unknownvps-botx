const makeRequest = require("./apiRequest");

async function getUserDetails(userId) {
    const responseData = await makeRequest('get', `/users/info/${userId}`)
    return responseData.data
}

module.exports = getUserDetails;