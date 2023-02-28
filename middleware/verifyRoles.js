const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401);
        const rolesArray = [ ...allowedRoles ];
     //   console.log(rolesArray);
       // console.log(req.roles);
        const result = req.roles.map(role => rolesArray.includes(role)) //output is boolean. Checks if rolesarray has the role property in it
        .find(val => val === true) // then we look for the values that have the true value so we can see the roles that have permission to access the routes
        if (!result) return res.sendStatus(401);
        next();
    };
};

module.exports = verifyRoles