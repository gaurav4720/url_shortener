const { getUser } = require('../service/auth');

// async function restrictToLoggedInUserOnly(req, res, next) {
//     // const userUid = req.cookies?.uid;

//     // if (!userUid) res.redirect('/login');
//     // const user = getUser(userUid);

//     const userUid = req.headers["authorization"];
//     if (!userUid) return res.redirect('/login');
//     const token = userUid.split("Bearer ")[1];
//     const user = getUser(token);

//     if (!user) return res.redirect('/login');
    
//     req.user = user;
//     next();
// }

// async function checkAuth(req, res, next) {
//     // const userUid = req.cookies?.uid;

//     const userUid = req.headers["authorization"];
//     if (userUid) {
//         console.log(req.headers);
//         const token = userUid.split("Bearer ")[1];

//         const user = getUser(token);
//         req.user = user;
//         next();
//     } else {
//         return res.render("login");
//     }
// }

function checkForAuthentication(req, res, next) {
    // const authorizationHeaderValue = req.headers["authorization"];
    // req.user = null;

    // if (
    //     !authorizationHeaderValue ||
    //     !authorizationHeaderValue.startsWith("Bearer")
    // )
    //     return next();
    
    // const token = authorizationHeaderValue.split("Bearer ")[1];
    // const user = getUser(token);

    // req.user = user;
    // return next();

    const tokenCookie = req.cookies?.uid;
    req.user = null;

    if (!tokenCookie) return next();

    const user = getUser(tokenCookie);
    req.user = user;
    return next();
}

function restrictTo(roles) {
    return function (req, res, next) {
        if (!req.user) return res.render("login");

        if (!roles.includes(req.user.role)) return res.end("UnAuthorized");

        return next();
    }
}

module.exports = {
    // restrictToLoggedInUserOnly,
    // checkAuth
    checkForAuthentication,
    restrictTo
}