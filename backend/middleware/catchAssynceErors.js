// this middleware is created is because if we forget to any detail like name,description then the server will go on running and at last throw an error 
// to overcome this error we will create a new middleware

module.exports = (theFunc) => (req,res,next) =>{

    // much similar to try function and in case if throw error the catch fn will called
    Promise.resolve(theFunc(req,res,next)).catch(next);
    
} 