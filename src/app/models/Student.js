import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        birthdate: Sequelize.STRING,
        registration: Sequelize.INTEGER,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsToMany(models.Classroom, {
      through: 'student_classrooms',
      foreignKey: 'studentId',
      as: 'students',
    });
  }
}

export default Student;
