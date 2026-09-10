import { Request, Response, NextFunction } from 'express';
import Company from '../models/company';
import Employee from '../models/employees';
import Department from '../models/department';
import Project from '../models/project';
import User from '../models/users';

export const FREE_PLAN_LIMITS = {
    companies: 1,
    employees: 10,
    departments: 5,
    projects: 5
} as const;

export const checkPlanLimit = (resource: 'companies' | 'employees' | 'departments' | 'projects') => {
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            const user = await User.findById(req.userId).select('plan');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const plan = user.plan || 'free';
            if (plan !== 'free') {
                return next();
            }

            const limit = FREE_PLAN_LIMITS[resource];
            let currentCount = 0;

            switch (resource) {
                case 'companies':
                    currentCount = await Company.countDocuments({ owner: req.userId });
                    break;
                case 'employees':
                    const userCompanies = await Company.find({ owner: req.userId }).select('_id');
                    const companyIds = userCompanies.map((c: any) => c._id);
                    currentCount = await Employee.countDocuments({ companies: { $in: companyIds } });
                    break;
                case 'departments':
                    const deptCompanies = await Company.find({ owner: req.userId }).select('_id');
                    const deptCompanyIds = deptCompanies.map((c: any) => c._id);
                    currentCount = await Department.countDocuments({ company: { $in: deptCompanyIds } });
                    break;
                case 'projects':
                    const projCompanies = await Company.find({ owner: req.userId }).select('_id');
                    const projCompanyIds = projCompanies.map((c: any) => c._id);
                    currentCount = await Project.countDocuments({ company: { $in: projCompanyIds } });
                    break;
            }

            if (currentCount >= limit) {
                return res.status(403).json({
                    message: `Free plan limit reached. You can only have ${limit} ${resource} on the free plan.`,
                    limit,
                    currentCount
                });
            }

            next();
        } catch (error: any) {
            next(error);
        }
    };
};
