import jwt from "jsonwebtoken"

const genrateTokenAndSetCookie = (UserId,res) => {
    const token = jwt.sign({UserId},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

    res.cookie("jwt",token,{
        maxAge : 15 * 24 * 60 * 60 *1000,
        httpOnly : true,
        sameSite:"strict"
    })
}

export default genrateTokenAndSetCookie;