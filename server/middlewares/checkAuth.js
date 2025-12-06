const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config();

const secret = process.env.JWT_SECRET;

const setUser = async ({_id , email ,username })=>{

    const token = jwt.sign({_id  ,email , username } , secret , {expiresIn:'7d'} );
    return token;
}

const getUser =async (token)=>{
 
    const user = jwt.verify(token , secret);

    return user;
}

module.exports={
    setUser,
    getUser
}