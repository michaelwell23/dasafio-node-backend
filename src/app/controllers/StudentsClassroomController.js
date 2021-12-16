import * as Yup from 'yup';

import Classroom from '../models/Classroom';
import Student from '../models/Student';
import Teacher from '../models/Teacher';
import StudentsClassroom from '../models/StudentsClassroom';

class StudentController {
  async index(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!teacher) {
      return res.json({ Error: 'Registration teacher does not exists' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const studentClass = await StudentsClassroom.findAll({
      where: { id: id },
    });

    if (!studentClass) {
      return res.status(400).json('Class does not exist');
    }

    return res.json(studentClass);
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
      classroom_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const { id } = req.params;

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    const teacherId = id;

    if (!teacher) {
      return res.json({ Error: 'Registration teacher does not exists' });
    }

    const classroom = await StudentsClassroom.findAll({
      where: { id: teacherId },
      include: {
        model: Student,
      },
    });

    console.log(classroom);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
      classroom_id: Yup.number().required(),
      student_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!teacher) {
      return res.json({ Error: 'Registration teacher does not exists' });
    }

    const classroom = await Classroom.findOne({
      where: { id: req.body.classroom_id },
    });

    if (!classroom) {
      return res.json({ Error: 'Classroom does not exist' });
    }

    const classroomId = classroom.id;

    const studentClass = await StudentsClassroom.findOne({
      where: { classroom_id: req.body.classroom_id },
    });

    if (studentClass.student_id.lenght > classroom.capacity.max) {
      classroom.availability = false;
      await classroom.save();
    }

    const student = await Student.findOne({
      where: { id: req.body.student_id },
    });

    const studentId = student.id;

    if (!student) {
      return res.json({ Error: 'student does not exist' });
    }

    const studentClassroom = await StudentsClassroom.create({
      student_id: studentId,
      classroom_id: classroomId,
    });

    return res.json(studentClassroom);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!teacher) {
      return res.json({ Error: 'Registration teacher does not exists' });
    }

    const studentClassroom = await StudentsClassroom.findOne({
      where: { id: req.params.id },
    });

    const { student_id, classroom_id } = await studentClassroom.update(
      req.body
    );

    return res.json({ student_id, classroom_id });
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!teacher) {
      return res.json({ Error: 'Registration teacher does not exists' });
    }

    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const classroom = await Classroom.findByPk(id);

    const studentClassroom = await StudentsClassroom.findByPk(id);

    if (studentClassroom.student_id.lenght > classroom.capacity.max) {
      classroom.availability = false;
      await classroom.save();
    }

    await studentClassroom.destroy();

    return res.json('Your data has been successfully deleted');
  }
}

export default new StudentController();
