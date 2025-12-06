const { getUser } = require("./checkAuth");


const authMiddleware=async(req ,res ,next)=>{
    try{
        let token =req.headers.authorization?.split(' ')[1];
        if(!token){
            return res.status(401).json({message:'No token , authorization denied'});
        }
        const user= await getUser(token);
        console.log(user);
        req.user=user;
        next();
    }catch(error){
        res.status(401).json({message:'Token is not valid'});
    }
}
module.exports=authMiddleware;