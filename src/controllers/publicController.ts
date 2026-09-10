import { Request, Response, NextFunction } from 'express';
import Company from '../models/company';
import Employee from '../models/employees';
import Department from '../models/department';
import Project from '../models/project';
import User from '../models/users';

export const getLandingStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            totalCompanies,
            totalEmployees,
            totalDepartments,
            totalProjects,
            totalUsers,
            activeCompanies
        ] = await Promise.all([
            Company.countDocuments(),
            Employee.countDocuments(),
            Department.countDocuments(),
            Project.countDocuments(),
            User.countDocuments(),
            Company.countDocuments({ isActive: true })
        ]);

        res.status(200).json({
            totalCompanies,
            totalEmployees,
            totalDepartments,
            totalProjects,
            totalUsers,
            activeCompanies
        });
    } catch (error: any) {
        next(error);
    }
};

export const getDashboardPreview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const demoCompany = await Company.findOne({ isDemo: true, isActive: true }).lean();
        if (!demoCompany) {
            return res.status(200).json({
                companies: 0,
                employees: 0,
                departments: 0,
                projects: 0,
                activeProjects: 0,
                recentProjects: []
            });
        }

        const [
            employees,
            departments,
            projects
        ] = await Promise.all([
            Employee.countDocuments({ company: demoCompany._id }),
            Department.countDocuments({ company: demoCompany._id }),
            Project.find({ company: demoCompany._id }).sort({ createdAt: -1 }).limit(5).lean()
        ]);

        const activeProjects = projects.filter((p: any) => p.status === 'ongoing').length;

        res.status(200).json({
            companies: 1,
            employees,
            departments,
            projects: projects.length,
            activeProjects,
            recentProjects: projects.map((p: any) => ({
                name: p.name,
                status: p.status,
                manager: p.manager
            }))
        });
    } catch (error: any) {
        next(error);
    }
};
