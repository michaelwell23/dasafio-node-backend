import * as Yup from 'yup';

import Student from '../models/Student';
import Teacher from '../models/Teacher';
import Classroom from '../models/Classroom';

class StudentController {
  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const studentsClassroom = await Student.findAll({
      as: 'classrooms',
      attributes: ['id', 'name', 'registration', 'birthdate'],
      include: [
        {
          model: Classroom,
          as: 'students',
          attributes: ['number_class'],
          include: [
            {
              model: Teacher,
              as: 'teachers',
              attributes: ['name'],
            },
          ],
        },
      ],
    });

    return res.json(studentsClassroom);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
      birthdate: Yup.string().required(),
      registration: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const studentEmailExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentEmailExists) {
      return res
        .status(400)
        .json({ Erro: 'There is a registered stundent with this email' });
    }

    const registrationExists = await Student.findOne({
      where: { registration: req.body.registration },
    });

    if (registrationExists) {
      return res
        .status(400)
        .json({ Erro: 'This registration is already registered' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      birthdate: Yup.string(),
      registration: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const { email, registration } = req.body;

    const student = await Student.findOne({ where: { id: req.params.id } });

    if (email !== student.email) {
      const studentEmailExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentEmailExists) {
        return res
          .status(400)
          .json({ Erro: 'There is a registered stundent with this email' });
      }
    }

    const registrationExists = await Student.findOne({
      where: { registration: req.body.registration },
    });

    if (!registrationExists) {
      return res.status(400).json({
        Erro: 'Registration number different from the registered one',
      });
    }

    const { id, name, birthdate } = await student.update(req.body);

    return res.json({ id, name, email, birthdate, registration });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json('Student does not exist');
    }

    await student.destroy();
    return res.json('Your data has been successfully deleted');
  }
}

export default new StudentController();
