import { Request, Response, NextFunction } from 'express';
import Project from '../models/project';
import { CustomError } from '../utils/customError';
import Employee from '../models/employees';

const getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const projects = await Project.find()
            .populate('company')
            .populate('manager')
            .populate('members');

        if (projects.length === 0) {
            const error: any = new CustomError('No project added yet', 404);
            return next(error);
        } else {
            res.status(200).json({
                Total: projects.length,
                message: "Here are the projects found",
                projects
            })
        }
    } catch (e: any) {
        const error: any = new CustomError('Failed to get projects', 500);
        return next(error);

    }
}



const getProjectsByName = async (req: Request<{ name: string }>, res: Response, next: NextFunction) => {
    try {
        const name = req.params.name;
        if (!name) {
            const error: any = new CustomError('To get the project the name is required', 400);
            next(error);
        }

        const projects = await Project.find({ name: { $regex: name, $options: 'i' } })
            .populate('company')
            .populate('manager')
            .populate('members');
        if (projects.length === 0) {
            const error: any = new Error('No project found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            Total: projects.length,
            message: "Here are the projects found",
            projects
        })
    } catch (e: any) {
        console.log(e.message)
        const error: any = new Error('Failed to get project');
        error.status = 500;
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
    getAllProjects,
    getProjectsByName,
    addProject,
    updateProjectById,
    deleteProjectById,
    addMemberToProject
};