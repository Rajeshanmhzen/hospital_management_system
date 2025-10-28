export const errorHandler = (err, req, res, next)=> {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Intenal Sever Error";

    res.status(statusCode).json({
        error:true,
        success:false,
        message,
        stack:process.env.NODE_ENV === "development"? err.stack:undefined
    })
}