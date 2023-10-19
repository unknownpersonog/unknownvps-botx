const makeRequest = require("./apiRequest");
const getUserDetails = require("./getUserDetails");

async function checkUserExists(userId) {
    const result = await makeRequest('GET', `/users/info/${userId}`)
    if (result.response.status === 200) {
        return true
    }
    if (!(result.response.status === 200)) {
        return false
    }
    else {
        console.log('AN ERROR OCCURED')
        return true
    }
}

module.exports = checkUserExists;