const Company = require('../models/company');

const addCompany = async (req,res, next)=>{
    try {
        const {name, code, email, phone, address, isActive} = req.body;
        if(!name || !code){
            return res.status(400).json({message: "The company name  and code should be provided"});
        }

        const company = await Company.create({
            name,
            code,
            email,
            phone,
            address,
            isActive

        })
        res.status(202).json({message: "Company added successfully"}).json(company);
    } catch (error) {
        res.status(500).json({message: "Failed to add company"});
        console.log(error.message)
        
    }
}

module.exports = {
    addCompany
}