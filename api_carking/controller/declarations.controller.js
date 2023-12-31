
const declarationsService = require('../services/declarations.service');
const vehiculeService = require('../services/vehicules.service');
const db = require('../config/db');
const Vehicule = db.vehicule;

class declarationsControllers {

    //create declarations
    async create(req, res, next){
        try {
            const { dateEntre, typeDeclaration, userId, vehiculeId } = req.body;
            const Id = await req.user.user.id;
            console.log("userId", userId)
            const newDeclaration= await declarationsService.createDeclaration({
                dateEntre,
                typeDeclaration,
                userId: Id,
                vehiculeId
            });

            return res.status(201).json({
                success: true,
                message: "déclaration created successfully",
                data: newDeclaration
            });
        }catch(error){
            next(error);
        }
    }

    async createDeclarationByAgent(req, res, next){
        try {
            const { dateEntre, typeDeclaration, userId } = req.body;
           

            const newDeclaration= await declarationsService.createDeclaration({
                dateEntre,
                typeDeclaration,
                userId
            });

            return res.status(201).json({
                success: true,
                message: "déclaration created successfully",
                data: newDeclaration
            });
        }catch(error){
            next(error);
        }
    }

    //read
    async read(req, res, next){
        try {
            const declarations = await db.declaration.findAll({
                include: [
                  {
                    model: db.vehicule,
                    as: 'vehicule',
                    attributes: ['matricule', 'chassis', 'marque', 'couleur'],
                  },
                ],
              });
            return res.status(200).json({
                success: true,
                message: "declaration fetched successfully",
                data: declarations
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
        const declarationFound = await declarationsService.getDeclarationById(id);
        if(!declarationFound){
            return res.status(400).json({
                success: false,
                message: "declaration not found"
            })
        }

        //get data from body
        const { dateEntre, typeDeclaration } = req.body;

        //update vehicule
        const updateDeclaration = await declarationsService.updateDeclaration(id, {
            dateEntre,
            typeDeclaration
        })

        return res.status(200).json({
            success: true,
            message: "declaration updated successfully",
            data: updateDeclaration
        });
       }catch(error){
           next(error);
       }
    }

    //delete
    async delete(req, res, next){
        try {
            const { id } = req.params;
            const declarationFound = await declarationsService.getDeclarationById(id);
            if(!declarationFound){
                return res.status(400).json({
                    success: false,
                    message: "declaration not found"
                })
            }

            await declarationsService.deleteDeclaration(id);
            return res.status(200).json({
                success: true,
                message: "déclaration deleted successfully"
            });
        }catch(error){
            next(error);
        }
    }

    
    //get vehicule by id
    async getDeclarationById(req, res, next){
        try {
            const { id } = req.params;
            const declarationFound = await declarationsService.getDeclarationById(id);
            if(!declarationFound){
                return res.status(400).json({
                    success: false,
                    message: "declaration not found"
                })
            }

            return res.status(200).json({
                success: true,
                message: "declaration fetched successfully",
                data: declarationFound
            });
        }catch(error){
            next(error);
        }
    }
    
    async createdDeclarationByUserConnect(req, res, next){
        try{
            const { dateEntre, typeDeclaration, vehiculeId} = req.body;
            const user = req.user.user.id;
            const createDeclaration = await declarationsService.createDeclaration({
                dateEntre,
                typeDeclaration,
                userId : user,
                vehiculeId
            })
            return res.status(201).json({
                success: true,
                data: createDeclaration
            })
        }catch(error){
            return res.status(400).json({
                error: error.message
            })
        }
    }

}

module.exports = new declarationsControllers();