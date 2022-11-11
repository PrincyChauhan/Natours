const AppError = require("../utils/appError");

const handleCastErrorDB=err=>{
  const message=`Invalid ${err.path}:${err.value}.`
  return new AppError(message,400);
}


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  // operational ,trusted error:send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.messsge
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1.Log Error
    console.log('Error', err);
    // 2.Send generate message
    res.status(500).json({
      status: 'error',
      message: 'Something went very Wrong'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    sendErrorProd(err, res);
  }
};
