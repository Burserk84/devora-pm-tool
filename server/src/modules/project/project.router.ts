import { Router } from 'express';
import { getProjects, createProject } from './project.handler';

const projectRouter = Router();

// Apply the protect middleware to all routes in this file
projectRouter.get('/', getProjects);
projectRouter.post('/', createProject);

export default projectRouter;