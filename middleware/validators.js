const { body, validationResult } = require('express-validator');

function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  return next();
}

const authValidators = {
  signIn: [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  signUp: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ]
};

const forumValidators = {
  createPost: [
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
    body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
  ]
};

const counselingValidators = {
  createSession: [
    body('topic').trim().notEmpty().withMessage('Topic is required'),
    body('preferredDate').notEmpty().withMessage('preferredDate is required')
  ]
};

module.exports = {
  validateRequest,
  authValidators,
  forumValidators,
  counselingValidators
};
