const Company = require('../models/company');


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
        return next(e);
        
    }
}


const getCompaniesByName = async (req,res,next) =>{
    try {
        const name = req.params.name;
        if(!name){
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
        return next(e);
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
            return res.status(201).json({message: "Company added successfully",company})
            
        }
    } catch (e) {
        return next(e);   
    }
}


const updateCompanyById = async (req, res , next) =>{
    try {
        const id = req.params.id;
        const newCompany = await Company.findByIdAndUpdate(
            id,
            req.body,
            {new: true, runValidators: true}
        );

        res.status(200).json({message: "Company updated",newCompany: newCompany})
        
        
    } catch (e) {
        return next(e);
    }
}


const deletecompanyById = async (req,res,next) =>{
    try {
        const id = req.params.id;
        if(await Company.findOne({id}).length ===0){
            const error = new Error('no company found');
            error.status =404;
            return next(error);
        }
        await Company.findByIdAndDelete(id);
        res.status(200).json({message: "company deleted"})
    } catch (e){
        return next(e)     
    }
}

module.exports = {
    getAllCompanies,
    getCompaniesByName,
    addCompany,
    updateCompanyById,
    deletecompanyById
    
}