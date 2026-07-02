import { Request, Response, NextFunction } from 'express';
import Department from '../models/department';
import Company from '../models/company';
import { CustomError } from '../utils/customError';

const getCompanyDepartments = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const company = req.params.company;
        const companyDoc = await Company.findOne({ _id: company, owner: req.userId });
        if (!companyDoc) {
            const err: any = new CustomError("Company not found or access denied", 404);
            return next(err)
        }
        const departments = await Department.find({ company })
            .populate('company')
            .populate('manager')
            .populate('members');

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
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('the id is required', 400);
            return next(error);
        }
        const department = await Department.findById(id)
            .populate('company')
            .populate('manager');
        if (!department) {
            const err: any = new CustomError("No department found", 404);
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

const addDepartment = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { name, company, manager } = req.body;
        const companyDoc = await Company.findOne({ _id: company, owner: req.userId });
        if (!companyDoc) {
            const err: any = new CustomError("Company not found or access denied", 404);
            return next(err);
        }
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


const updateDepartmentById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const department = await Department.findById(id).populate('company');
        if (!department) {
            const err: any = new CustomError("No department found", 404);
            return next(err);
        }
        const company = await Company.findOne({ _id: department.company, owner: req.userId });
        if (!company) {
            const err: any = new CustomError("Access denied", 403);
            return next(err);
        }
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


const deleteDepartmentById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params as { id: string };
        if (!id) {
            const error: any = new CustomError('id is required', 400);
            return next(error);
        }
        const department = await Department.findById(id).populate('company');
        if (!department) {
            const error: any = new CustomError('No department found', 404);
            return next(error);
        }
        const company = await Company.findOne({ _id: department.company, owner: req.userId });
        if (!company) {
            const error: any = new CustomError('Access denied', 403);
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