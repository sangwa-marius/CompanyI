import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employees';
import Company from '../models/company';
import Department from '../models/department';
import { CustomError } from '../utils/customError';


const getCompanyEmployees = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = req.params.company;
    const companyDoc = await Company.findOne({ _id: company, owner: req.userId });
    if (!companyDoc) {
      const err: any = new CustomError("Company not found or access denied", 403);
      return next(err);
    }
    const allEmployees = await Employee.find({ companies: { $in: [company] } })
      .populate('companies')
      .populate('department')
    
    res.status(200).json({ employees: allEmployees });
  } catch (e: any) {
    return next(e);
  }
}


const getEmployeeById = async (
  req: any,
  res: Response,
  next: NextFunction) => {

  try {
    const id = req.params.id;

    if (!id) {
      const error: any = new Error('please provide an id');
      error.status = 400;
      return next(error);
    }
    const employee = await Employee.findById(id)
      .populate('companies')
      .populate('department')

    if (!employee) {
      const error: any = new Error('No employee found');
      error.status = 404;
      return next(error);
    }
    const companyIds = employee.companies?.map((c: any) => c._id) || [];
    const hasAccess = await Company.exists({ _id: { $in: companyIds }, owner: req.userId });
    if (!hasAccess) {
      const error: any = new Error('Access denied');
      error.status = 403;
      return next(error);
    }
    return res.status(200).json(employee);
  } catch (e: any) {
    e.status = 500;
    return next(e);
  }
};

const addEmployee = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, company, department, status, hiredAt, names, phone } = req.body;
    const companyDoc = await Company.findOne({ _id: company, owner: req.userId });
    if (!companyDoc) {
      const err: any = new CustomError("Company not found or access denied", 403);
      return next(err);
    }
    const employeeExists = await Employee.findOne({ email }).exec();
    if (employeeExists) {
      await Employee.updateOne(
        { _id: employeeExists._id },
        { $addToSet: { companies: company } }
      );
      const updated = await Employee.findById(employeeExists._id)
        .populate('companies')
        .populate('department');
      return res.status(200).json({ message: "Employee added successfully", newEmployee: updated });
    }
    
    const newEmployee = await Employee.create({
      names,
      email,
      phone,
      department: department || undefined,
      status,
      hiredAt: hiredAt || undefined,
      companies: [company]
    });

    if (department) {
      await Department.findByIdAndUpdate(department, {
        $addToSet: { members: newEmployee._id }
      });
    }
    
    const populated = await Employee.findById(newEmployee._id)
      .populate('companies')
      .populate('department');
    
    res.status(201).json({ message: "Employee added successfully", newEmployee: populated });
  } catch (error: any) {
    return next(error);
  }
};

const updateEmployeeById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: any = new Error('Provide the id');
      error.status = 400;
      return next(error);
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      const error: any = new Error('No Employee found');
      error.status = 400;
      return next(error);
    }
    const companyIds = employee.companies || [];
    const hasAccess = await Company.exists({ _id: { $in: companyIds }, owner: req.userId });
    if (!hasAccess) {
      const error: any = new Error('Access denied');
      error.status = 403;
      return next(error);
    }
    const newDepartmentId = req.body.department || undefined;
    const oldDepartmentId = employee.department || undefined;

    const newEmployee = await Employee.findByIdAndUpdate(
      id,
      { ...req.body, department: newDepartmentId },
      { new: true, runValidators: true }
    ).populate([
      { path: 'companies' },
      { path: 'department' },

    ]);

    if (String(oldDepartmentId || '') !== String(newDepartmentId || '')) {
      if (oldDepartmentId) {
        await Department.findByIdAndUpdate(oldDepartmentId, {
          $pull: { members: employee._id }
        });
      }
      if (newDepartmentId) {
        await Department.findByIdAndUpdate(newDepartmentId, {
          $addToSet: { members: employee._id }
        });
      }
    }

    res.status(200).json({ message: "Employee updated", newEmployee: newEmployee });

  } catch (error: any) {
    return next(error);
  }
}

const deleteEmployeeById = async (req: any, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;
    if (!id) {
      const error: any = new Error('provide the id');
      error.status = 400;
      return next(error);
    }
    const employee = await Employee.findById(id);
    if (!employee) {
      const error: any = new Error('No employee found');
      error.status = 404;
      return next(error);
    }
    const companyIds = employee.companies || [];
    const hasAccess = await Company.exists({ _id: { $in: companyIds }, owner: req.userId });
    if (!hasAccess) {
      const error: any = new Error('Access denied');
      error.status = 403;
      return next(error);
    }
    await Employee.findByIdAndDelete(id);

    if (employee.department) {
      await Department.findByIdAndUpdate(employee.department, {
        $pull: { members: employee._id }
      });
    }

    res.status(200).json({ message: "Employee removed successfully" })
  } catch (error: any) {
    return next(error)

  }
}
export default {
  getCompanyEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeById,
  deleteEmployeeById
};