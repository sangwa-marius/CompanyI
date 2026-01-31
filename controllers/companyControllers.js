const Company = require('../models/company');
const { findOne } = require('../models/employees');


const getAllCompanies = async (req,res, next) =>{
    try {
        const companies = await Company.find();

        if(!companies){
            const error = new Error('No companies found');
            error.status = 404;
            return next(error)
        }else{
            res.status(200).json({
                Total: companies.length,
                message: "Here are the companies found",
                companies
            })
        }
    } catch (e) {
        const error = new Error(e.message);
        error.status = 500;
        return next(error);
        
    }
}


const getCompaniesByName = async (req,res,next) =>{
    try {
        const name = req.params.name;
        if(name.length ===0){
            const error = new Error('Name is required');
            error.status = 400;
            return next(error);
        }
        const companies = await Company.find({name:{$regex: name, $options: 'i'}});
        if(companies.length === 0){
            const error = new Error('No companies found');
            error.status = 404;
            return next(error)
        }else{
             res.status(200).json({Total: companies.length, companies});
             return 
        }
    } catch (e) {
        const error =new Error(e.message);
        error.status = 500;
        return next(error);
    }
}



const addCompany = async (req,res, next)=>{
    try {
        const {name, code, email, phone, address, isActive} = req.body;
        if(!name || !code){
            const error = new Error("The company name  and code should be provided");
            error.status = 400;
            return next(error);
        }else{
            const company = await Company.create({
                name,
                code,
                email,
                phone,
                address,
                isActive
            })
            res.status(202).json({message: "Company added successfully"}).json(company);
            return 
        }
    } catch (e) {
        const error = new Error(e.message);
        error.status = 500;
        return next(error);   
    }
}


const updateCompanyByName = async (req, res , next) =>{
    try {
        const name = req.params.name;
        const {code, email,phone, address,isActive} = req.body;
        if(!code){
            const error = new Error('The school code is required');
            error.status = 400;
            return next(error);
        }
       else{
            const newCompany = await Company.findOneAndUpdate({name},{
                code,
                email, 
                phone,
                address,
                isActive
            })

            res.status(200).json({
                message: "Company updated successfully",
                NewCompany : newCompany
            })
        }
    } catch (e) {
        const error = new Error(e.message);
        error.status = 500;
        return next(error);
    }
}

module.exports = {
    getAllCompanies,
    getCompaniesByName,
    updateCompanyByName,
    addCompany,
    
}