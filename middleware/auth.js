const jwt = require ('jsonwebtoken');
const config = require ('config');

module.exports = function (req, res, next) {
    //Get the token from the header
    const token = req.header('x-auth-token');

    //Check if no token exists
    if (!token) {
        return res.sendStatus(401).json({
            msg: 'No token, authorization denied'
        });
    }

    //Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();//common for any middle ware
    } catch (error) {
        res.sendStatus(401).json({
            msg: "Token is not valid"
        });
        console.error(error);
    }
}