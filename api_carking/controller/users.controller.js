
const userService = require('../services/users.service');
const { hashPassword } = require('../utils/helpers');
const { Role } = require('../utils/enum')


class usersControllers {

    async fetchCurentUser(req, res, next){
        const id = req.user.user.id;
        const userFound = await userService.getUserById(id);
        try {
            if(!userFound){
                return res.status(400).json({
                    message: "user not found"
                })
            }
            return res.status(200).json({
                success: true,
                message: "user fetched successfully",
                data: userFound
            });
        }catch(error){
            next(error);
        }
    }

    //create
    async create(req, res, next){
        try {
            const { firstName, lastName, name, phoneNumber, email, password } = req.body;
            const userFound = await userService.getUserByEmail(email);

            if(userFound){
                return res.status(400).json({message: "user already exist"});
            }

            const newUser = await userService.createUser({
                name, 
                email, 
                firstName,
                lastName,
                phoneNumber,
                name,
                password: await hashPassword(password)
            });

            return res.status(201).json({
                success: true,
                message: "user created successfully",
                data: newUser
            });
        }catch(error){
            next(error);
        }
    }

    //read
    async read(req, res, next){
        let options = {
            where : {
                RoleId: Role.proprietaire.id || Role.Agent.id
            }
        }
        try {
            const users = await userService.getAllUsersOptions(options);
            return res.status(200).json({
                success: true,
                message: "users fetched successfully",
                data: users
            });
        }catch(error){
            next(error);
        }
    }

    //update
    async update(req, res, next){   

        //get id from params
        const { id } = req.params;
       try{
        const userFound = await userService.getUserById(id);
        if(!userFound){
            return res.status(400).json({
                success: false,
                message: "user not found"
            })
        }

        //get data from body
        const { name, email } = req.body;

        //update user
        const updatedUser = await userService.updateUser(id, {
            name,
            email,
        })

        return res.status(200).json({
            success: true,
            message: "user updated successfully",
            data: updatedUser
        });
       }catch(error){
           next(error);
       }
    }

    //delete
    async delete(req, res, next){
        try {
            const { id } = req.params;
            const userFound = await userService.getUserById(id);
            if(!userFound){
                return res.status(400).json({
                    success: false,
                    message: "user not found"
                })
            }

            await userService.deleteUser(id);

            return res.status(200).json({
                success: true,
                message: "user deleted successfully"
            });
        }catch(error){
            next(error);
        }
    }

    //get user by id
    async getUserById(req, res, next){
        try {
            const { id } = req.params;
            const userFound = await userService.getUserById(id);
            if(!userFound){
                return res.status(400).json({
                    success: false,
                    message: "user not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "user fetched successfully",
                data: userFound
            });
        }catch(error){
            next(error);
        }
    }

}

module.exports = new usersControllers();