import { Request, Response, NextFunction } from 'express';
import Department from '../models/department';
import { CustomError } from '../utils/customError';

const getAllDepartments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const departments = await Department.find()
            .populate('company', 'name code email')
            .populate('manager', ' name email phone');
        if (departments.length === 0) {
            const err:any= new CustomError("No departments found",404);
            return next(err)
        }
        res.status(200).json({
            Total: departments.length,
            message: "Here are the departments found",
            departments
        })
    } catch (e: any) {
        e.status = 500;
        return next(e);
    }
}


const getDepartmentsByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name;
        if (!name) {
            const error: any = new CustomError('name is required',400);
            return next(error);
        }
        const departments = await Department.find({ name })
            .populate('company', 'name code email')
            .populate('manager', ' name email phone');
        if (departments.length === 0) {
            const err:any = new CustomError("No department found",404);
            return next(err);
        }
        res.status(200).json({
            Total: departments.length,
            message: "Here are the departments found",
            departments
        })
    } catch (e: any) {
        return next(e);
    }
}

const addDepartment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, company, manager } = req.body;
        const newDepartment = await Department.create({
            name,
            company,
            manager
        })

        res.status(201).json({ message: "Department added successfully", newDepartment });

    } catch (e: any) {
        return next(e)
    }
}


const updateDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const newDepartment = await Department.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('company', 'name code email')
            .populate('manager', ' name email phone');


        res.status(200).json({ message: "Department updated successfull", newDepartment });
    } catch (e: any) {
        return next(e)
    }
}


const deleteDepartmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            const error: any = new CustomError('id is require',400)
            return next(error);
        }
        if (!(await Department.findOne({ id }))) {
            const error: any = new CustomError('no department found',404);
            return next(error);
        }

        await Department.findByIdAndDelete(id);
        res.status(200).json({ message: "department deleted successfully" })


    } catch (e: any) {
        return next(e);
    }
}


export {
    getAllDepartments,
    getDepartmentsByName,
    addDepartment,
    updateDepartmentById,
    deleteDepartmentById
};