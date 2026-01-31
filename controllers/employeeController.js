const employee = require ('../models/employees')

const getAllEmployees = async (req,res,next)=>{
    try {
        const allEmployees = await employee.find()
        .populate('company','name code email phone')
        .populate('department','name ')
        .populate('role','name permissions ');
        res.status(200).json(allEmployees);
    } catch (e) {
        e.status = 500;
        return next(e);
    }
}


const searchEmployeesByName = async (req, res, next) => {
  const search = req.query.name;

  if (search.length ===0) {
    const error = new Error('please provide a name');
    error.status = 400;
    return next(error);
  }

  try {
    const employees = await employee.find({names: { $regex: search, $options: 'i' }})
    .populate('company','name code email phone')
    .populate('department','name ')
    .populate('role','name permissions ');

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

const addEmployee = async (req,res, next)=>{
    try {
        const {name ,email, company,department, role, status, hirdAt} = req.body;
        if(!name || !email || !company || !department || !role){
          const error = new Error('name, email,company,department and role are required ');
          error.status =400;
          return next(error);
        }
        if(!mongoose.Types.ObjectId.isValid(company)){
          const error = new Error('company id not valid');
          error.status = 400;
          return next(error);
        }else if(!mongoose.Types.ObjectId.isValid(department)){
          const error = new Error('department id is not valid');
          error.status = 400;
          next(error);
        }else if(!mongoose.Types.ObjectId.isValid(department))
        await employee.create(newEmployee);
        res.status(201).json({message:'employee added successfully'})
    } catch (error) {
        console.log(error.message)
        
    }
}

const addMannyEmployees = async (req,res)=>{
  const newEmployees = req.body;
  try {
    await employee.insertMany(newEmployees);
    res.status(201).json({Message:"Employees added successfully"})
  } catch (error) {
    console.log(error.message)
  }
}

const deleteEmployee = async (req,res)=>{
  const names = req.params.names;
  if(!names){
    return  res.status(400).json({Message:"you should add a name please"})
  }
  try {
    const employe = await employee.findOne({names:names}); 
    if(!employe){
      return res.status(404).json({Message:"Employee not found"});
    }
  
    await employee.deleteOne({names:names});
    res.status(200).json({Message:"Employee deleted from the database successfully"})
    
  } catch (error) {
    console.log(error)
    
  }
}
module.exports = {
    getAllEmployees,
    searchEmployeesByName,
    addEmployee,
    addMannyEmployees,
    deleteEmployee
}

