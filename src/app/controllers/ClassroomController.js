import * as Yup from 'yup';

import Classroom from '../models/Classroom';
import Teacher from '../models/Teacher';

class ClassroomController {
  async index(req, res) {
    const { id } = req.params;
    const { registration } = req.body;

    const teacher = await Teacher.findOne({
      where: { id: id },
    });

    if (teacher.id != id) {
      return res.status(400).json({ Error: 'ID is invalid' });
    }

    if (teacher.registration != registration) {
      return res.status(400).json({ Error: 'Registration is invalid' });
    }
    const classroom = await Classroom.findAll({
      attributes: ['number_class', 'capacity_max', 'availability', 'teacherId'],
      include: [
        {
          model: Teacher,
          as: 'teachers',
          attributes: ['id', 'name', 'registration'],
        },
      ],
    });

    return res.json(classroom);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number().required(),
      number_class: Yup.number().required(),
      capacity_max: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!teacher) {
      return res.status(400).json({ Erro: 'Registration does not exist' });
    }

    const teacherId = teacher.id;

    const classExists = await Classroom.findOne({
      where: { number_class: req.body.number_class },
    });

    if (classExists) {
      return res.json({ Error: 'Class number is exists' });
    }

    const { number_class, capacity_max, availability } = req.body;

    console.log(teacher);

    const classroom = await Classroom.create({
      teacherId,
      number_class,
      capacity_max,
      availability,
    });

    return res.json(classroom);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      registration: Yup.number(),
      number_class: Yup.number(),
      capacity_max: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ Error: 'Validations fails' });
    }

    const { registration } = req.body;

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (teacher.registration != registration) {
      return res.status(400).json({ Error: 'Registration is invalid' });
    }

    const { id } = req.params;

    const classroom = await Classroom.findByPk(id);

    if (!id) {
      return res
        .status(400)
        .json({ Error: "there isn't even a classroom with this id" });
    }

    const { number_class, capacity_max, availability } = await classroom.update(
      req.body
    );

    res.json({ id, number_class, capacity_max, availability });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const { registration } = req.body;

    const teacher = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (teacher.registration != registration) {
      return res.status(400).json({ Error: 'Registration is invalid' });
    }

    const classroom = await Classroom.findByPk(id);

    if (!classroom) {
      return res.status(400).json('Classroom does not exist');
    }

    await classroom.destroy();
    return res.json('Your data has been successfully deleted');
  }
}
export default new ClassroomController();
