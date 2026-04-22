import { Request, Response, NextFunction } from 'express';
import Department from '../models/department';
import { CustomError } from '../utils/customError';

const getCompanyDepartments = async (
    req: Request<{company:string}>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const company = req.params.company;
        if(!company){
            const err:any = new CustomError("The company is required",400);
            return next(err)
        }
        const departments = await Department.find({company})
            .populate('company')
            .populate('manager')
            .populate('members');
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
        return next(e);
    }
}


const getDepartmentById = async (
    req: Request<{id:string}>, 
    res: Response, 
    next: NextFunction
) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('the id is required',400);
            return next(error);
        }
        const department = await Department.findById(id)
            .populate('company')
            .populate('manager');
        if (!department) {
            const err:any = new CustomError("No department found",404);
            return next(err);
        }
        res.status(200).json({
            message: "Here are the departments found",
            department
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
        ).populate('company')
            .populate('manager');


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
    getCompanyDepartments,
    getDepartmentById,
    addDepartment,
    updateDepartmentById,
    deleteDepartmentById
};