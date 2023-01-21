exports.userSignUpValidator = (req, res, next) => {
    req.check('name', 'name is required').notEmpty();
    req.check('email', 'email must be 3 to 32 characters long')
        .matches(/.+\@.+\..+/)
        .withMessage('Email must contain @. Please enter a valid email address')
        .isLength({
            min: 3,
            max: 32
        });
    req.check('password', 'password is required').notEmpty();
    req.check('password')
        .isLength({min: 6})
        .withMessage('Password must be at least 6 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number');
    const errors = req.validationErrors();
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({error: firstError});
        }
        next();

}