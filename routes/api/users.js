const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const User = require('../../models/User');
const config = require('config');

/**
 * @route   GET api/users
 * @desc    Test route
 * @access  Public
 */
router.get('/', (req, res) => {
    res.send('User route');
});

/**
 * @route   POST api/users
 * @desc    Registers User
 * @access  Public
 */
 router.post('/', [
     check('name', 'Name is required').not().isEmpty(),
     check('email', 'Please include valid email').isEmail(),
     check('password', 'Please enter a password with 6 or more characters').isLength({min: 6})
 ], async (req, res) => {
    
    const errors = validationResult(req);    
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    const {name, email, password} = req.body;//deconstructs the data from the json response to only include what you want

    try {

        let user = await User.findOne ({email});

        //Test if user already exists
        if (user) {
            return res.sendStatus(400).json({
                errors: [
                    {
                        msg: "User already exists"
                    }
                ]
            });
        }

        //Get gravatar
        const avatar = gravatar.url( email, {
            s: '200',
            r: 'pg',
            d: 'mm'
        });
        
        user = new User({
            name,
            email,
            avatar,
            password
        });//creates a new instance of the user object

        //Encrypt password
        const salt = await bcrypt.genSalt(10);//number of rounds.. more is better
        user.password = await bcrypt.hash(user.password, salt);//creates a hash for the password entered

        //Save to database
        await user.save();//Saves the user to the database

        user.save().then((data) => {

            const payload = {
                user: {
                    id: data.id
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
            res.send("User registered");
        }).catch((err) => {
            console.error(err);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
    }

    // res.send('User route success w/ proper data');
    
});

module.exports = router;