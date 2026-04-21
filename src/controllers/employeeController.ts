import { Request, Response, NextFunction } from 'express';
import employee from '../models/employees';
import { CustomError } from '../utils/customError';


const getCompanyEmployees = async (
  req: Request<{company:string}>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const company = req.params.company;
    if(!company){
      const err:any = new CustomError("Company should be provided",400);
      return next(err);
    }
    const allEmployees = await employee.find({companies:{$in:[company]}})
      .populate('company')
      .populate('department')
      .populate('role');
    res.status(200).json(allEmployees);
  } catch (e: any) {
    return next(e);
  }
}


const searchEmployeesByName = async (
  req: Request<{ name: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction) => {

  try {
    const name = req.params.name;

    if (!name) {
      const error: any = new Error('please provide a name');
      error.status = 400;
      return next(error);
    }
    const employees = await employee.find({ names: { $regex: name, $options: 'i' } })
      .populate('company', 'name code email phone')
      .populate('department', 'name ')
      .populate('role', 'name permissions ');

    if (employees.length === 0) {
      const error: any = new Error('No employee found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(employees);
  } catch (e: any) {
    e.status = 500;
    return next(e);
  }
};

const addEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newEmployee = new employee(req.body);
    await newEmployee.save();
    await newEmployee.populate([
      { path: 'company', select: 'name code email phone' },
      { path: 'department', select: 'name' },
      { path: 'role', select: 'name permissions' }
    ])

    res.status(201).json({ message: "Employee added successfully", newEmployee })
  } catch (error: any) {
    return next(error);

  }
}

const updateEmployeeById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: any = new Error('Provide the id');
      error.status = 400;
      return next(error);
    }

    if (!(await employee.findOne({ _id: id }))) {
      const error: any = new Error('No Employee found');
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

  } catch (error: any) {
    return next(error);
  }
}

const deleteEmployeeById = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: any = new Error('provide the id');
      error.status = 400;
      return next(error);
    }
    await employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted" })
  } catch (error: any) {
    return next(error)

  }
}
export {
  getCompanyEmployees,
  searchEmployeesByName,
  addEmployee,
  updateEmployeeById,
  deleteEmployeeById
};