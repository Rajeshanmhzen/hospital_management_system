import jwt from "jsonwebtoken"

export const authToken = async(req, res, next)=> {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split("") [1];
    }
    if(!token) {
       return  res.status(400).json({
            error:true,
            messsage:"Not authorized",
        });
    }
     try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.id = decode.id
            next()
        } catch (err) {
            res.status(400).json({
                error:true,
                message:"Token invalid or expired",
            });
        };
};

