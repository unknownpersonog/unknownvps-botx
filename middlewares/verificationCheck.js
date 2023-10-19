const getUserDetails = require("../functions/getUserDetails");

async function verificationCheck(userId) {
    const result  = await getUserDetails(`${userId}`)
    if (result.verified === 'true') {
        return true
    } else {
        return false
    }
}

module.exports = verificationCheck