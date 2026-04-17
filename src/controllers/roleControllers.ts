import { Request, Response, NextFunction } from 'express';
import Role from '../models/role';

const getCompanyRoles = async (req: Request<{ companyId: string }>, res: Response, next: NextFunction) => {
    const { companyId } = req.params;
    if (!companyId) {
        const error: any = new Error("Please  provide a companyId");
        error.status = 400;
        next(error)
    }
    try {
        const roles = await Role.find({ company: companyId })
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


const addRole = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const newRole = new Role(req.body)
        await newRole.save();
        await newRole.populate('company', 'name code email phone');
        res.status(201).json({ message: "Role added successfully", newRole });
    } catch (error: any) {
        return next(error);
    }
}

const updateRoleById = async (req:Request<{id:string}>, res:Response, next:NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new Error('provide the id');
            error.status = 400;
            return (error);
        }

        if (!(await Role.findOne({ id }))) {
            const error: any = new Error(`No Role with id ${id}`);
            error.status = 400;
            return next(error);
        }

        const newRole = await Role.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('company', 'name, code email, phone');
        res.status(200).json({
            message: "Role updated",
            new: newRole
        });
    } catch (error: any) {
        return next(error);
    }
}

const deleteRoleById = async (req:Request<{id:string}>, res:Response, next:NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new Error('Provide the id');
            error.status = 400;
            return next(error);
        }

        if (!(await Role.findOne({ id }))) {
            const error: any = new Error(`No role with id ${id}`);
            error.status = 400;
            return next(error);
        }

        await Role.findByIdAndDelete(id);
        res.status(200).json({ message: "Role deleted" })
    } catch (error: any) {
        return next(error);
    }
}

export {
    getCompanyRoles,
    addRole,
    updateRoleById,
    deleteRoleById
};