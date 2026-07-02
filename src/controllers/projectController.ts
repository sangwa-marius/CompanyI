import { Request, Response, NextFunction } from 'express';
import Project from '../models/project';
import Company from '../models/company';
import Employee from '../models/employees';
import { CustomError } from '../utils/customError';
import mongoose from 'mongoose';

const getAllCompanyProjects = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.companyId;
        if(!mongoose.Types.ObjectId.isValid(id)){
            const error: any = new CustomError('Provide a valid company id', 400);
            return next(error);
        }
        const companyDoc = await Company.findOne({ _id: id, owner: req.userId });
        if (!companyDoc) {
            const error: any = new CustomError("Company not found or access denied", 403);
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



const getProjectById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('To get the project the id is required', 400);
            next(error);
            return;
        }

        const project = await Project.findById(id)
            .populate('company')
            .populate('manager')
            .populate('members');
        
        if (!project) {
            const error: any = new CustomError('Project not found', 404);
            return next(error);
        }
        
        const companyDoc = await Company.findOne({ _id: project.company, owner: req.userId });
        if (!companyDoc) {
            const error: any = new CustomError('Access denied', 403);
            return next(error);
        }
        
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

const addProject = async (req: any, res: Response, next: NextFunction) => {
    try {
        const { company } = req.body;
        const companyDoc = await Company.findOne({ _id: company, owner: req.userId });
        if (!companyDoc) {
            const error: any = new CustomError('Company not found or access denied', 403);
            return next(error);
        }
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


const updateProjectById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('Provide the id', 400);
            return next(error);
        }

        const project = await Project.findById(id);
        if (!project) {
            const error: any = new CustomError(`No project with id ${id}`, 400);
            return next(error);
        }

        const companyDoc = await Company.findOne({ _id: project.company, owner: req.userId });
        if (!companyDoc) {
            const error: any = new CustomError('Access denied', 403);
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
    req: any,
    res: Response,
    next: NextFunction
) => {
    const { projectId } = req.params;
    const { member } = req.body;
    if (!projectId || !member) {
        return next(new CustomError('Provide the project id and member id', 400));
    }
    const project = await Project.findById(projectId);
    if (!project) {
        return next(new CustomError(`No project with id ${projectId}`, 400));
    }
    
    const companyDoc = await Company.findOne({ _id: project.company, owner: req.userId });
    if (!companyDoc) {
        return next(new CustomError('Access denied', 403));
    }
    
    if (!(await Employee.findById(member))) {
        return next(new CustomError(`No employee with id ${member}`, 400));
    }

    try {
        const newProject = await Project.findByIdAndUpdate(
            projectId,
            { $addToSet: { members: member } },
            { new: true }
        );
        res.status(200).json({ message: "Member added to project successfully", newProject });
    } catch (error) {
        return next(new CustomError('Failed to add member to project', 500));
    }
}


const deleteProjectById = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error: any = new CustomError('Provide the id', 400);
            return next(error);
        }

        const project = await Project.findById(id);
        if (!project) {
            const error: any = new CustomError(`No project with id ${id}`, 404);
            return next(error);
        }
        
        const companyDoc = await Company.findOne({ _id: project.company, owner: req.userId });
        if (!companyDoc) {
            const error: any = new CustomError('Access denied', 403);
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