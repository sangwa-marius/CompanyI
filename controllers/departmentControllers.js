const Department = require('../models/department');

const getAllDepartments = async (req, res, next) => {
    try {
        const departments = await Department.find()
            .populate('company', 'name code email')
            .populate('manager', ' name email phone');
        if (departments.length === 0) {
            return res.status(404).json({ message: "No department added yet" })
        }
        res.status(200).json({
            Total: departments.length,
            message: "Here are the departments found",
            departments
        })
    } catch (e) {
        e.status = 500;
        return next(e);
    }
}


const getDepartmentsByName = async (req, res, next) => {
    try {
        const name = req.params.name;
        if (!name) {
            const error = new Error('name is required');
            error.status(400);
            return next(error);
        }
        const departments = await Department.find({ name })
            .populate('company', 'name code email')
            .populate('manager', ' name email phone');
        if (departments.length === 0) {
            return res.status(404).json({ message: "No department found" })
        }
        res.status(200).json({
            Total: departments.length,
            message: "Here are the departments found",
            departments
        })
    } catch (e) {
        return next(e);
    }
}

const addDepartment = async (req, res, next) => {
    try {
        const { name, company, manager } = req.body;
        const newDepartment = await Department.create({
            name,
            company,
            manager
        })

        res.status(201).json({ message: "Department added successfully" });

    } catch (e) {
        return next(e)
    }
}


const updateDepartmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        const newDepartment = await Department.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('company', 'name code email')
         .populate('manager', ' name email phone');


        res.status(200).json({ message: "Department updated successfull", newDepartment });
    } catch (e) {
        return next(e)
    }
}


const deleteDepartmentById = async (req, res, next) => {
    try {
        const id = req.params.id;
        if (!id) {
            const error = new Error('id is require');
            error.status = 400;
            return next(error);
        }
        if (!await Department.findOne({ id })) {
            const error = new Error('no department found');
            error.status = 404;
            return next(error);
        }

        await Department.findOneAndDelete({ name });
        res.status(200).json({ message: "department deleted successfully" })


    } catch (e) {
        return next(e);
    }
}


module.exports = {
    getAllDepartments,
    getDepartmentsByName,
    addDepartment,
    updateDepartmentById,
    deleteDepartmentById
}