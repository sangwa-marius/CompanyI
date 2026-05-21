import { Request, Response, NextFunction } from 'express';
import Project from '../models/project';
import { CustomError } from '../utils/customError';
import Employee from '../models/employees';
import mongoose from 'mongoose';

const getAllCompanyProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.companyId as any;
        if(!mongoose.Types.ObjectId.isValid(id)){
            const error: any = new CustomError('Provide a valid company id', 400);
            return next(error);
        }
        const projects = await Project.find({company: req.params.companyId})
            .populate('company')
            .populate('manager')
            .populate('members');
        
            res.status(200).json({
                Total: projects.length,
                message: "Here are the projects found",
                projects
            })
        
    } catch (e: any) {
        const error: any = new CustomError(e.message, 500);
        return next(error);

    }
}



const getProjectById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('To get the project the id is required', 400);
            next(error);
        }

        const project = await Project.findById(id)
            .populate('company')
            .populate('manager')
            .populate('members');
      
        res.status(200).json({
            message: "Here is the project found",
            project
        })
    } catch (e: any) {
        console.log(e.message)
        const error: any = new CustomError('Failed to get project', 500);
        return next(error);

    }
}



const addProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        await newProject.populate('company');
        await newProject.populate('manager');
        await newProject.populate('members');

        res.status(201).json({ message: "project added", newProject })
    } catch (e: any) {
        return next(e);
    }
}


const updateProjectById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('Provide the id', 400);
            return next(error);
        }

        if (!(await Project.findById(id))) {
            const error: any = new CustomError(`No project with id ${id}`, 400);
            return next(error);
        }

        const newProject = await Project.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('company')
            .populate('manager')
            .populate('members');

        res.status(200).json({ message: "project updated successfull", newProject })

    } catch (e: any) {
        return next(e);
    }

}

const addMemberToProject = async (
    req:Request<{projectId: string},{},{employeeId: string}>,
    res:Response,
    next:NextFunction
)=>{
    if(!req.params.projectId || !req.body.employeeId){
        return next(new CustomError('Provide the project id and employee id',400));
    }
    if(!(await Project.findById(req.params.projectId))){
        return next(new CustomError(`No project with id ${req.params.projectId}`,400));
    }
    if(!(await Employee.findById(req.body.employeeId))){
        return next(new CustomError(`No employee with id ${req.body.employeeId}`,400));
    }

    try {
        const newProject = await Project.findByIdAndUpdate(
            req.params.projectId,
            { $addToSet: { members: req.body.employeeId } },
            { new: true }   
        );
        res.status(200).json({ message: "Member added to project successfully", newProject });
    } catch (error) {
        return next(new CustomError('Failed to add member to project', 500));
    }


}


const deleteProjectById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('Provide the id', 400);
            return next(error);
        }

        if (!(await Project.findOne({ id }))) {
            const error: any = new CustomError(`No project with Id ${id}`, 400);
            return next(error);
        }

        await Project.findByIdAndDelete(id);
        res.status(200).json({ message: "project deleted" })
    } catch (e: any) {
        return next(e);

    }
}

export {
    getAllCompanyProjects,
    getProjectById,
    addProject,
    updateProjectById,
    deleteProjectById,
    addMemberToProject
};