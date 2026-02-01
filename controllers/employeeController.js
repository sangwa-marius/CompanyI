const employee = require('../models/employees')

const getAllEmployees = async (req, res, next) => {
  try {
    const allEmployees = await employee.find()
      .populate('company', 'name code email phone')
      .populate('department', 'name ')
      .populate('role', 'name permissions ');
    res.status(200).json(allEmployees);
  } catch (e) {
    e.status = 500;
    return next(e);
  }
}


const searchEmployeesByName = async (req, res, next) => {
  const search = req.params.search;

  if (!search) {
    const error = new Error('please provide a name');
    error.status = 400;
    return next(error);
  }

  try {
    const employees = await employee.find({ names: { $regex: search, $options: 'i' } })
      .populate('company', 'name code email phone')
      .populate('department', 'name ')
      .populate('role', 'name permissions ');

    if (employees.length === 0) {
      const error = new Error('No employee found');
      error.status = 404;
      next(error);
    }
    return res.status(200).json(employees);
  } catch (e) {
    e.status = 500;
    return next(e);
  }
};

const addEmployee = async (req, res, next) => {
  try {
    const newEmployee = await employee.create(req.body)
      .populate([
        { path: 'company', select: 'name code email phone' },
        { path: 'department', select: 'name' },
        { path: 'role', select: 'name permissions' }
      ])

    res.status(201).json({ message: "Employee added successfully", newEmployee })
  } catch (error) {
    return next(error);

  }
}

const updateEmployeeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error = new Error('Provide the id');
      error.status = 400;
      return next(error);
    }

    if (!await employee.findOne({ id }) === 0) {
      const error = new Error('No Employee found');
      error.status = 400;
      return next(error);
    }
    const newEmployee = await employee.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate([
      { path: 'company', select: 'name code email phone' },
      { path: 'department', select: 'name' },
      { path: 'role', select: 'name permissions' }
    ]);

    res.status(200).json({ message: "Employee updated", newEmployee: newEmployee });

  } catch (error) {
    return next(error);
  }
}

const deleteEmployeeById = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error = new Error('provide the id');
      error.status = 400;
      return next(error);
    }
    await employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted" })
  } catch (error) {
    return next(error)

  }
}
module.exports = {
  getAllEmployees,
  searchEmployeesByName,
  addEmployee,
  updateEmployeeById,
  deleteEmployeeById
}

