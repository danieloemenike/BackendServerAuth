const express = require('express');
const router = express.Router();
const employeeController = require('../../controllers/employeesController')
const ROLES_LIST = require("../../config/roles_list")
const verifyRoles = require("../../middleware/verifyRoles")

router.route('/')
    //we only set it to the get but it can be added to more
    .get(employeeController.getAllEmployees) //It will go to the middleware first before the controller. Everyone can access the get route
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.createNewEmployee) //passing in the verify role, just editor and Admin can access this route
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),employeeController.updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin),employeeController.deleteEmployee);

router.route('/:id')
    .get(employeeController.getEmployee)




module.exports = router