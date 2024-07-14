const sessionIdToUserMap = new Map();

const jwt = require('jsonwebtoken');
const secretKey= "Gaurav@123$"

function setUserStateful(id, user) {
    sessionIdToUserMap.set(id, user);
}

function getUserStateful(id) {
    return sessionIdToUserMap.get(id);
}

function setUser(user) {
    return jwt.sign({
        _id: user._id,
        email: user.email,
        role: user.role
    }, secretKey);
}

function getUser(token) {
    if (!token) return null;
    try {
        return jwt.verify(token, secretKey);
    } catch (error) {
        return null;
    }
}

module.exports = {
    setUser,
    getUser
}