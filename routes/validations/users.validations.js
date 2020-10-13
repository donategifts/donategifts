const { body, validationResult } = require('express-validator')

const signupValidationRules = () => {
    return [
        body('fName').notEmpty().isString(),
        body('lName').notEmpty().isString(),
        body('email').isString().isEmail().trim(),
        body('password').notEmpty().isString().isLength({min: 8}),
        body('passwordConfirm').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Password confirmation does not match password');
            }
            return true;
        }),
        body('userRole').isString().notEmpty()
    ]
}

const updateProfileValidationRules = () => {
    return [
        body('aboutMe').exists()
    ]
};

const createAgencyValidationRules = () => {
    return [
        body('agencyName').isString().notEmpty(),
        body('agencyWebsite').optional(),
        body('agencyPhone').isNumeric().isLength({min:7, max: undefined}).notEmpty(),
        body('agencyBio').optional(),
    ]
};

const loginValidationRules = () => {
    return [
        body('email').isString().notEmpty().isEmail().trim(),
        body('password').isString().notEmpty()
    ]
}

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        return res.status(400).send({
            success: false,
            error: errors.array({onlyFirstError: true})[0].msg,
        });
    }
    next();
};

module.exports = {
    signupValidationRules,
    updateProfileValidationRules,
    createAgencyValidationRules,
    loginValidationRules,
    validate,
}