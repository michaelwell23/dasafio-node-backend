import * as Yup from 'yup';

import Teacher from '../models/Teacher';

class TeacherController {
  async show(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const teacher = await Teacher.findAll({
      where: { id: id },
    });

    if (!teacher) {
      return res.status(400).json('Teacher does not exist');
    }

    return res.json(teacher);
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

    const teacherEmailExists = await Teacher.findOne({
      where: { email: req.body.email },
    });

    if (teacherEmailExists) {
      return res
        .status(400)
        .json({ Erro: 'There is a registered stundent with this email' });
    }

    const registrationExists = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (registrationExists) {
      return res
        .status(400)
        .json({ Erro: 'This registration is already registered' });
    }

    const teacher = await Teacher.create(req.body);

    return res.json(teacher);
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

    const teacher = await Teacher.findOne({ where: { id: req.params.id } });

    if (email !== teacher.email) {
      const teacherEmailExists = await Teacher.findOne({
        where: { email: req.body.email },
      });

      if (teacherEmailExists) {
        return res
          .status(400)
          .json({ Erro: 'There is a registered stundent with this email' });
      }
    }

    const registrationExists = await Teacher.findOne({
      where: { registration: req.body.registration },
    });

    if (!registrationExists) {
      return res
        .status(400)
        .json('Registration number different from the registered one');
    }

    const { id, name, birthdate } = await teacher.update(req.body);

    return res.json({ id, name, email, birthdate, registration });
  }

  async delete(req, res) {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json('enter your id');
    }

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(400).json('Teacher does not exist');
    }

    await teacher.destroy();
    return res.json('Your data has been successfully deleted');
  }
}

export default new TeacherController();
