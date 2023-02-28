const User = require('../model/User');
const handleLogout = async (req, res) => {
    //on client, also delete the accessToken

    const cookies = req.cookies;
    //if we don't have cookies check if we have jwt properties
    if (!cookies?.jwt) return res.sendStatus(204); //no content to send back
    //is refresh token in db?, checks refreshToken controller 
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser)
    {
        res.clearCookie('jwt', { httpOnly: true });
        return res.sendStatus(204); //means it was successful but no content
    };
    //delete refresh token in display: 'block',
    foundUser.refreshToken = ""; //sets the refresh token to empty
    const result = await foundUser.save(); //this save() back to mongodb document. FoundUser is a document that we need to update with the save.
    console.log(result)
    res.clearCookies('jwt', { httpOnly: true, sameSite:'None' }); //secure:true - only serves on https
    res.sendStatus(204)  //all is well but we have no content to send back
}

module.exports = {handleLogout}