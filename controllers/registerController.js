const User = require('../model/User');
/*const usersDB = {
    users: require("../model/users.json"),
    setUsers: function(data) {this.users = data}
};*/ //local json db created 
//const fsPromises = require('fs').promises;
//const path = require('path');
const bcrypt = require('bcrypt'); //for salting and hashing passwords


const handleNewUser = async (req, res) => {
 //the user and pwd is from the form submitted by the client.
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ "message": "username and password are required" })
    //check for duplicated usernames in the database
    const duplicate = await User.findOne({ username: user }).exec(); //exec is only used for aysnc and await
    
    if (duplicate) return res.sendStatus(409);//conflict -409
    try
    {
        //encrypt the password
        //10 represents the salt rounds to be used in encrypting the pwd.
        const hashedPWD = await bcrypt.hash(pwd, 10) 
        //create and store new user
        const result = await User.create({
            "username": user,
            "password": hashedPWD
        }) //we don't need to add user roles and id because it has been specified earlier and will be generated automatically
         

        console.log(result)
        res.status(201).json({"success":`New user ${user} created`})
    } catch (err)
    {
        res.status(500).json({"message": err.message})
    }
};

module.exports = { handleNewUser}