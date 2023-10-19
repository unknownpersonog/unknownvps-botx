const makeRequest = require("./apiRequest");

async function getVPSDetails(vpsId) {
    const responseData = await makeRequest('get', `/vps/info/${vpsId}`)
    return responseData.data
}

module.exports = getVPSDetails;