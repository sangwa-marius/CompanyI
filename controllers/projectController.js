const  Project = require('../models/project');
const mongoose = require('mongoose');

const addProject = async (req ,res, next) =>{
    try {
        const { name, company, manager, members, status} = req.body;
        if(!name ||!manager){
            return res.status(400).json({message: "Project name and company are required"});
        }

        if(!mongoose.Types.ObjectId.isValid(company)){
            return res.status(400).json({message: "The company ID is invalid"});
        }

        if(!mongoose.Types.ObjectId.isValid(manager)){
            return res.status(400).json({message: "The manager ID is invalid"});
        }

        const project = await Project.create({
            name,
            company,
            manager,
            members,
            status
        })

        res.status(201).json({message: "Project added successfully",project});
    } catch (error) {
        res.status(500).json({message: "Can't add the Project"});
        console.log(error.message)
    }
}


module.exports = {
    addProject
};