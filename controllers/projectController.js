const  Project = require('../models/project');
const mongoose = require('mongoose');

const getAllProjects = async(req,res, next) =>{
    try {
        const projects = await Project.find()
        .populate('company', 'name code email phone address')
        .populate('manager',' names email phone  ')
        .populate('members', 'names email phone');

        if(projects.length === 0){
            const error = new Error('No project added yet');
            error.status = 404;
            return next(error);
        }else{
            res.status(200).json({
                Total: projects.length,
                message: "Here are the projects found",
                projects
            })
        }
    } catch (e) {
        console.log(e.message);
        const error = new Error('Failed to get projects');
        error.status = 500;
        return next(error);
        
    }
}



const getProjectsByName = async (req,res,next)=>{
    try {
        const name = req.params.name;
        if(!name){
            const error = new Error('To get the project the name is required');
            error.status = 400;
            next(error);
        }

        const projects = await Project.find({name:{$regex:name, $options:'i'}})
        .populate('company', 'name code email phone address')
        .populate('manager',' names email phone  ')
        .populate('members', 'names email phone');
        if(projects.length === 0){
            const error = new Error('No project found');
            error.status = 404;
            return next(error);
        }

        res.status(200).json({
            Total: projects.length,
            message: "Here are the projects found",
            projects
        })
    } catch (e) {
        console.log(e.message)
        const error = new Error('Failed to get project');
        error.status = 500;
        return next(error);
        
    }
}



const addProject = async (req ,res, next) =>{
    try {
        const { name, company, manager, members, status} = req.body;
        const project = await Project.find({name:name});
        if(!name ||!company ||!manager){
            const error = new Error('Project name, company id and manage id are required');
            error.status = 400;
            return next(error);
        }else if(project.name ===name){
            const error = new Error(`Project ${name} already exists`);
            error.status = 400;
            return next(error);
         }else if(!mongoose.Types.ObjectId.isValid(company)){
            const error = new Error('Company id is invalid');
            error.status = 400;
            return next(error);
        }else if(!mongoose.Types.ObjectId.isValid(manager)){
            const error = new Error('Manager id is invalid');
            error.status = 400;
            return next(error);
        }else{
            const newProject = await Project.create({
                name,
                company,
                manager,
                members,
                status
            })
            res.status(201).json({message: "Project added successfully",newProject});
        }
    } catch (e) {
        const error = new Error(e.message);
        error.status = 500;
        console.log(e.message)
        return next(error);
    }
}


const updateProjectByname = async(req,res,next) =>{
    try {
        const name = req.params.name;
        const {company, manager, members,status} = req.body;

        if(name.length ===0){
           const error = new Error('project name is required to update');
           error.status = 400;
           return next(error);
        }

        if(!company ||!manager){
            const error = new Error('Company id and manage id are required');
            error.status = 400;
            return next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(company)){
            const error = new Error('Company id is invalid');
            error.status = 400;
            return next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(manager)){
            const error = new Error('Manager id is invalid');
            error.status = 400;
            return next(error);
        }

        

        const newProject = await Project.findOneAndUpdate(
            {name},
            {
                company,
                manager,
                members,
                status
            }
        );

        if(!newProject){
            const error = new Error(`No project called ${name}`);
            error.status = 400;
            return next(error);
        }

        res.status(200).json({message: "Project updated successfully"});
    } catch (e) {
        console.log(e.message)
        const error = new Error(`Failed to add project ${name}`);
        error.status = 500;
        return next(error);
    }

}


const deleteProjectByName = async (req,res,next) =>{
    try {
        const name = req.params.name;
        if(!name){
            const error = new Error('The name of the project should be provided');
            error.status = 400;
            return next(error);
        }

        const project = await Project.findOne({name:name});
        if(!project){
            const error = new Error('Project not found');
            error.status = 404;
            return next(error);
        }

        await Project.deleteOne({name:name});
        res.status(200).json({message: "project deleted successfully"})
    } catch (e) {
        const error = new Error('Failed to delete the project');
        error.status = 500;
        next(error)
        return console.log(e.message)
        
    }
}

module.exports = {
    getAllProjects,
    getProjectsByName,
    addProject,
    updateProjectByname,
    deleteProjectByName
};