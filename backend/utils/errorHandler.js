
// errorhandler class is inherited from default class of
class ErrorHandler extends Error{
    // create a constructor which will take two parameters
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;

        // method which can be used in this class because we had inherited the class
        Error.captureStackTrace(this,this.statusCode);

    }

}

module.exports = ErrorHandler