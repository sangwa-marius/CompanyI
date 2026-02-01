const Project = require('../models/project');
const mongoose = require('mongoose');

const getAllProjects = async (req, res, next) => {
    try {
        const projects = await Project.find()
            .populate('company', 'name code email phone address')
            .populate('manager', ' names email phone  ')
            .populate('members', 'names email phone');

        if (projects.length === 0) {
            const error = new Error('No project added yet');
            error.status = 404;
            return next(error);
        } else {
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



const getProjectsByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        if (!name) {
            const error = new Error('To get the project the name is required');
            error.status = 400;
            next(error);
        }

        const projects = await Project.find({ name: { $regex: name, $options: 'i' } })
            .populate('company', 'name code email phone address')
            .populate('manager', ' names email phone  ')
            .populate('members', 'names email phone');
        if (projects.length === 0) {
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



const addProject = async (req, res, next) => {
    try {
        const newProject = new Project(req.body);
        await newProject.save();
        await newProject
            .populate('company', 'name code email phone address')
            .populate('manager', ' names email phone  ')
            .populate('members', 'names email phone');

        res.status(2001).json({ message: "project added" })
    } catch (e) {
        return next(e);
    }
}


const updateProjectById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error = new Error('Provide the id');
            error.status = 400;
            return next(error);
        }

        if (await Project.findOne({ id }) === 0) {
            const error = new Error(`No project with id ${id}`);
            error.status = 400;
            return next(error);
        }

        const newProject = await Project.findByIdAndUpdate(
            id,
            re.body,
            { new: true, runValidators: true }
        ).populate('company', 'name code email phone address')
         .populate('manager', ' names email phone  ')
         .populate('members', 'names email phone');

    } catch (e) {
        return next(e);
    }

}


const deleteProjectById = async (req, res, next) => {
    try {
       const id = req.params.id;
       if(!id){
        const error = new Error('Provide the id');
        error.status = 400;
        return next(error);
       }

       if(await Project.findOne({id})===0){
        const error = new Error(`No project with Id ${id}`);
        error.status = 400;
        return next(error);
       }

       await Project.findByIdAndDelete(id);
       res.status(200).json({message: "project deleted"})
    } catch (e) {
        return next(e);

    }
}

module.exports = {
    getAllProjects,
    getProjectsByName,
    addProject,
    updateProjectById,
    deleteProjectById
};