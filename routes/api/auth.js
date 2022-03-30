const express = require('express');
const router = express.Router();
const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');

/**
 * @route   GET api/auth
 * @desc    Test route
 * @access  Public
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.sendStatus(500).send('Server Error');
    }
    // res.send('Auth route');
});

/**
 * @route   POST api/auth
 * @desc    Authenticate user & get token
 * @access  Public
 */
 router.post('/', [
    check('email', 'Please include valid email').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
   
   const errors = validationResult(req);    
   if (!errors.isEmpty()) {
       return res.status(400).json({
           errors: errors.array()
       });
   }

   const {email, password} = req.body;//deconstructs the data from the json response to only include what you want

   try {

       let user = await User.findOne ({email});

       //Test if user already exists
       if (!user) {
           return res.sendStatus(400).json({
               errors: [
                   {
                       msg: "Invalid Credentials"
                   }
               ]
           });
       }

       const isMatch = await bcrypt.compare(password, user.password);

       if (!isMatch) {
        return res.sendStatus(400).json({
            errors: [
                {
                    msg: "Does not match"
                }
            ]
        });
       }

       const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload, 
            config.get('jwtSecret'), {
                expiresIn: 3600000,
            }, 
            (err, token) => {
                if (err) throw err;
                console.log({
                    tokenCreated: token
                });
                res.json ({
                    token
                });
            }
        );    
        // res.send("User registered");       

   } catch (error) {
       console.error(error);
       res.status(500).send('server error');
   }

   // res.send('User route success w/ proper data');
   
});

module.exports = router;