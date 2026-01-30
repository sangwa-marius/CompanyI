const  Project = require('../models/project');
const mongoose = require('mongoose');

const getAllProjects = async(req,res, next) =>{
    try {
        const projects = await Project.find()
        .populate('company', 'name code email phone address')
        .populate('manager',' names email phone  ')
        .populate('members', 'names email phone');

        if(!projects){
            const error = new Error('No project added yet');
            error.status = 404;
            next(error);
        }
        res.status(200).json({
            Total: projects.length,
            message: "Here are the projects found",
            projects
        })
    } catch (e) {
        const error = new Error('Failed to get projects');
        error.status = 500;
        next(error);
        console.log(e.message);
        
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
        next(error);
        
    }
}



const addProject = async (req ,res, next) =>{
    try {
        const { name, company, manager, members, status} = req.body;
        if(!name ||!company ||!manager){
            const error = new Error('Project name, company id and manage id are required');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(company)){
            const error = new Error('Company id is invalid');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(manager)){
            const error = new Error('Manager id is invalid');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(members)){
            const error = new Error('Members id is invalid');
            error.status = 400;
            next(error);
        }

        const project = await Project.create({
            name,
            company,
            manager,
            members,
            status
        })

        res.status(201).json({message: "Project added successfully",project});
    } catch (e) {
        const error = new Error('Failed to add Project');
        error.status = 500;
        next(error);
        console.log(e.message)
    }
}


const updateProjectByname = async(req,res,next) =>{
    try {
        const name = req.params.name;
        const {company, manager, members,status} = req.body;

        if(!name){
           const error = new Error('project name is required to update');
           error.status = 400;
           next(error);
        }

        if(!company ||!manager){
            const error = new Error('Company id and manage id are required');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(company)){
            const error = new Error('Company id is invalid');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(manager)){
            const error = new Error('Manager id is invalid');
            error.status = 400;
            next(error);
        }

        if(!mongoose.Types.ObjectId.isValid(members)){
            const error = new Error('Members id is invalid');
            error.status = 400;
            next(error);
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
            next(error);
        }

        res.status(200).json({message: "Project updated successfully"});
    } catch (e) {
        const error = new Error(`Failed to add project ${name}`);
        error.status = 500;
        next(error);
        console.log(e.message)
    }

}


const deleteProjectByName = async (req,res,next) =>{
    try {
        const name = req.params.name;
        if(!name){
            const error = new Error('The name of the project should be provided');
            error.status = 400;
            next(error);
        }

        const project = await Project.findOne({name:name});
        if(!project){
            const error = new Error('Project not found');
            error.status = 404;
            next(error);
        }

        await Project.deleteOne({name:name});
    } catch (e) {
        const error = new Error('Failed to delete the project');
        error.status = 500;
        next(error)
        console.log(e.message)
        
    }
}

module.exports = {
    getAllProjects,
    getProjectsByName,
    addProject,
    updateProjectByname,
    deleteProjectByName
};