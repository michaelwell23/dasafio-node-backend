import Sequelize, { Model } from 'sequelize';

class StudentClassroom extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER,
        classroom_id: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default StudentClassroom;
