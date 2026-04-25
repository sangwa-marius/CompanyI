import Company from '../models/company';
import { Request, Response, NextFunction } from "express"
import { CustomError } from '../utils/customError';
import Employee from "../models/employees"


const getAllCompanies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const companies = await Company.find();

        if (!companies) {
            const error: any = new CustomError("No Companies found", 404)
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


const getYourCompanies = async(
    req:any,
    res:Response, 
    next:NextFunction
)=>{
    try {
        const companies = await Company.find({owner:req.userId})
        if(companies.length ===0){
            const err:any = new CustomError("No companies",404);
            return next(err);
        }
        res.status(200).json(companies);
    } catch (error) {
        return next(error)
        
    }
}


const getCompany = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params
        if (!id) {
            const error: any = new CustomError("Name is required", 400)
            next(error);
            return
        }
        const company = await Company.findById(id);
        if (!company) {
            const error: any = new CustomError('No companies found', 404);
            next(error)
            return
        } else {
            res.status(200).json(company);
            return
        }
    } catch (e: any) {
        return next(e);
    }
}



const addCompany = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const loggedInUserId = req.userId
        const {
            name,
            email,
            phone,
            address,
            isActive
        } = req.body as {
            name: string,
            email: string,
            address: string,
            isActive: boolean,
            phone: string
        };
        if (!name) {
            const error: any = new CustomError("The company name  and code should be provided", 400);
            return next(error);
        } else {
            const company = await Company.create({
                name,
                email,
                owner: loggedInUserId,
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


const updateCompanyById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
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


const deletecompanyById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = req.params.id;
        console.log(id)
        if (!(await Company.findById(id))) {
            const error: any = new CustomError('no company found', 404);
            return next(error);
        }
        if(await Employee.updateMany(
            {companies:{$in:[id]}},
            {$pull:{companies:id}}
        ) && await Company.findByIdAndDelete(id)){
            res.status(200).json({ message: "company deleted" })
        }
    
    } catch (e: any) {
        return next(e)
    }
}

export {
    getAllCompanies,
    getYourCompanies,
    getCompany,
    addCompany,
    updateCompanyById,
    deletecompanyById

};