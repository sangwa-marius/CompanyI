import Role from '../models/role';

const getAllRoles = async (req, res, next) => {
    try {
        const roles = await Role.find()
            .populate([
                { path: 'company', select: 'name code email phone' }
            ]);

        if (roles.length === 0) {
            const error: any = new Error('No role added yet');
            error.status = 404;
            return next(error);
        }
        res.status(200).json({ Total: roles.length, message: "Here are all the roles", roles })
    } catch (error: any) {
        return next(error);
    }
}


const addRole = async (req,res,next)=>{
    try {
        const newRole = new Role(req.body)
        await newRole.save();
        await newRole.populate('company','name code email phone');
        res.status(201).json({message:"Role added successfully",newRole});
    } catch (error: any) {
        return next(error);
    }
}

const updateRoleById = async (req,res,next) =>{
    try {
        const id = req.params.id;
        if(!id){
            const error: any = new Error('provide the id');
            error.status = 400;
            return(error);
        }

        if (!(await Role.findOne({ id }))){
            const error: any = new Error(`No Role with id ${id}`);
            error.status = 400;
            return next(error);
        }

        const newRole = await Role.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true}
        ).populate('company','name, code email, phone');
        res.status(200).json({
            message: "Role updated",
            new: newRole
        });
    } catch (error: any) {
        return next(error);
    }
}

const deleteRoleById = async ( req, res, next) =>{
    try {
        const id = req.params.id;
        if(!id){
            const error: any = new Error('Provide the id');
            error.status = 400;
            return next(error);
        }

        if (!(await Role.findOne({ id }))){
            const error: any = new Error(`No role with id ${id}`);
            error.status = 400;
            return next(error);
        }

        await Role.findByIdAndDelete(id);
        res.status(200).json({message: "Role deleted"})
    } catch (error: any) {
        return next(error);
    }
}

export {getAllRoles,
    addRole,
    updateRoleById,
    deleteRoleById};