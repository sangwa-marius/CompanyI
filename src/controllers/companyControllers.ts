import Company from '../models/company';
import { Request, Response, NextFunction } from "express"
import { CustomError } from '../utils/customError';


const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await Company.find();

        if (!companies) {
            const error: any = new CustomError("No Companies found",404)
            next(error)
            return 
        } else {
            res.status(200).json({
                Total: companies.length,
                message: "Here are the companies found",
                companies
            })
        }
    } catch (e: any) {
        return next(e);

    }
}


const getCompaniesByName = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.params as { name: string };
        if (!name) {
            const error: any = new Error('Name is required');
            error.status = 400;
            return next(error);
        }
        const companies = await Company.find({ name: { $regex: name, $options: 'i' } });
        if (companies.length === 0) {
            const error: any = new Error('No companies found');
            error.status = 404;
            return next(error)
        } else {
            res.status(200).json({ Total: companies.length, companies });
            return
        }
    } catch (e: any) {
        return next(e);
    }
}



const addCompany = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, code, email, phone, address, isActive } = req.body;
        if (!name || !code) {
            const error: any = new Error("The company name  and code should be provided");
            error.status = 400;
            return next(error);
        } else {
            const company = await Company.create({
                name,
                code,
                email,
                phone,
                address,
                isActive
            })
            return res.status(201).json({ message: "Company added successfully", company })

        }
    } catch (e: any) {
        return next(e);
    }
}


const updateCompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        const newCompany = await Company.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Company updated", newCompany: newCompany })


    } catch (e: any) {
        return next(e);
    }
}


const deletecompanyById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!(await Company.findOne({ id }))) {
            const error: any = new Error('no company found');
            error.status = 404;
            return next(error);
        }
        await Company.findByIdAndDelete(id);
        res.status(200).json({ message: "company deleted" })
    } catch (e: any) {
        return next(e)
    }
}

export {
    getAllCompanies,
    getCompaniesByName,
    addCompany,
    updateCompanyById,
    deletecompanyById
};