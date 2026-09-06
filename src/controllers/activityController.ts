import { Request, Response, NextFunction } from 'express';
import Activity from '../models/activity';
import Company from '../models/company';
import Employee from '../models/employees';
import Project from '../models/project';
import { CustomError } from '../utils/customError';

const logActivity = async (req: any, res: Response, next: NextFunction) => {
  try {
    const { action, entityType, entityId, entityName, details } = req.body;
    const activity = await Activity.create({
      user: req.userId,
      action,
      entityType,
      entityId,
      entityName,
      details: details || '',
    });
    res.status(201).json({ activity });
  } catch (e: any) {
    return next(e);
  }
};

const getRecentActivities = async (req: any, res: Response, next: NextFunction) => {
  try {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const activities = await Activity.find({
      user: req.userId,
      createdAt: { $gte: twoDaysAgo },
    }).sort({ createdAt: -1 }).limit(20);

    res.status(200).json({ activities });
  } catch (e: any) {
    return next(e);
  }
};

const getAllActivities = async (req: any, res: Response, next: NextFunction) => {
  try {
    const [loggedActivities, userCompanies] = await Promise.all([
      Activity.find({ user: req.userId }).sort({ createdAt: -1 }).limit(100),
      Company.find({ owner: req.userId }).select('_id name createdAt'),
    ]);

    const companyIds = userCompanies.map((c) => c._id);

    const [employees, projects] = await Promise.all([
      companyIds.length > 0
        ? Employee.find({ companies: { $in: companyIds } }).select('names createdAt')
        : Promise.resolve([]),
      companyIds.length > 0
        ? Project.find({ company: { $in: companyIds } }).select('name createdAt')
        : Promise.resolve([]),
    ]);

    const historicalActivities = [
      ...userCompanies.map((c) => ({
        _id: `company-${c._id}`,
        action: 'Company Created',
        entityType: 'Company',
        entityId: c._id,
        entityName: c.name,
        details: `Company "${c.name}" was created`,
        createdAt: c.createdAt,
      })),
      ...employees.map((e) => ({
        _id: `employee-${e._id}`,
        action: 'Employee Added',
        entityType: 'Employee',
        entityId: e._id,
        entityName: e.names,
        details: `Employee "${e.names}" was added`,
        createdAt: e.createdAt,
      })),
      ...projects.map((p) => ({
        _id: `project-${p._id}`,
        action: 'Project Created',
        entityType: 'Project',
        entityId: p._id,
        entityName: p.name,
        details: `Project "${p.name}" was created`,
        createdAt: p.createdAt,
      })),
    ];

    const merged = [...loggedActivities, ...historicalActivities]
      .filter((a) => a.createdAt)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const seen = new Set<string>();
    const deduped = merged.filter((item) => {
      const key = `${item.entityType}-${item.entityId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    res.status(200).json({ activities: deduped.slice(0, 100) });
  } catch (e: any) {
    return next(e);
  }
};

export { logActivity, getRecentActivities, getAllActivities };
