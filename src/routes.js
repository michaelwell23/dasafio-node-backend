import { Router } from 'express';

import ClassroomController from './app/controllers/ClassroomController';
import StudentController from './app/controllers/StudentController';
import StudentsClassroomController from './app/controllers/StudentsClassroomController';
import TeacherController from './app/controllers/TeacherController';

const routes = Router();

routes.get('/students/:id', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);

routes.get('/teachers/:id', TeacherController.show);
routes.post('/teachers', TeacherController.store);
routes.put('/teachers/:id', TeacherController.update);
routes.delete('/teachers/:id', TeacherController.delete);

routes.get('/classrooms/:id', ClassroomController.index);
routes.get('/classrooms/:id', ClassroomController.show);
routes.post('/classrooms/', ClassroomController.store);
routes.put('/classrooms/:id', ClassroomController.update);
routes.delete('/classrooms/:id', ClassroomController.delete);

routes.get('/allocations/:id', StudentsClassroomController.index);
routes.post('/allocations', StudentsClassroomController.store);
routes.put('/allocations/:id', StudentsClassroomController.update);
routes.delete('/allocations/:id', StudentsClassroomController.delete);

export default routes;
