import { Sequelize } from 'sequelize';

import Teacher from '../app/models/Teacher';
import Student from '../app/models/Student';
import Classroom from '../app/models/Classroom';
import StudentsClassroom from '../app/models/StudentsClassroom';

import databaseConfig from '../config/database';

const models = [Teacher, Student, Classroom, StudentsClassroom];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
