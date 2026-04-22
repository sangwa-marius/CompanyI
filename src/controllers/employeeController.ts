import { Request, Response, NextFunction } from 'express';
import Employee from '../models/employees';
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
    const allEmployees = await Employee.find({companies:{$in:[company]}})
      .populate('companies')
      .populate('department')
      .populate('role');
    res.status(200).json(allEmployees);
  } catch (e: any) {
    return next(e);
  }
}


const getEmployeeById = async (
  req: Request<{id:string }, {}, {}, {}>,
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
      .populate('role',);

    if (!employee) {
      const error: any = new Error('No employee found');
      error.status = 404;
      return next(error);
    }
    return res.status(200).json(employee);
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
    const employeeExists = await Employee.findOne({email:req.body.email}) as any;
    if(employeeExists){
      console.log(employeeExists);
      const newEmployee = await Employee.updateOne(
        {_id:employeeExists._id},
        {$addToSet:{companies:req.body.company}}
      );
      return res.status(201).json({message:"Employee added sucessfully", newEmployee});
    }
    await Employee.create(req.body);
    await Employee.updateOne(
      {email:req.body.email},
      {$addToSet:{companies:req.body.company}}
    )
    const newEmployee = await Employee.findOne({email:req.body.email})


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

    if (!(await Employee.findOne({ _id: id }))) {
      const error: any = new Error('No Employee found');
      error.status = 400;
      return next(error);
    }
    const newEmployee = await Employee.findByIdAndUpdate(
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
    await Employee.findByIdAndDelete(id);
    res.status(200).json({ message: "Employee deleted" })
  } catch (error: any) {
    return next(error)

  }
}
export {
  getCompanyEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployeeById,
  deleteEmployeeById
};