module.exports = {
  BAD_REQUEST: {
    statusCode: 400,
    code: 4001,
    type: 'badRequest',
    placement: 'general',
    message: 'Invalid or badly formatted request'
  },
  INVALID: {
    statusCode: 400,
    code: 4002,
    type: 'invalid',
    placement: 'field',
    message: 'This field is invalid',
  },
  REQUIRED: {
    statusCode: 400,
    code: 4003,
    type: 'required',
    placement: 'field',
    message: 'This field is required',
  },
  UNAUTHORIZED: {
    statusCode: 401,
    code: 4011,
    type: 'unauthorized',
    placement: 'general',
    message: 'You are not authorized to perform this action'
  },
  AUTH_ERROR: {
    statusCode: 401,
    code: 4012,
    type: 'authError',
    placement: 'general',
    message: 'Invalid identification'
  },
  EXPIRED: {
    statusCode: 401,
    code: 4013,
    type: 'expired',
    placement: 'general',
    message: 'Your session has expired, please reconnect'
  },
  FORBIDDEN: {
    statusCode: 403,
    code: 4031,
    type: 'forbidden',
    placement: 'general',
    message: 'Your rights do not allow you to do this action'
  },
  NOT_FOUND: {
    statusCode: 404,
    code: 4041,
    type: 'notFound',
    placement: 'general',
    message: 'Ressource not found'
  },
  UNPROCESSABLE: {
    statusCode: 422,
    code: 4221,
    type: 'unprocessableEntity',
    placement: 'field',
    message: 'This resource already exists in the database'
  },
  INTERNAL: {
    statusCode: 500,
    code: 5001,
    type: 'internalServer',
    placement: 'general',
    message: 'An error has occurred, if the problem persists please contact an administrator'
  },
};
