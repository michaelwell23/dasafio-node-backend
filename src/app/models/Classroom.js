import Sequelize, { Model } from 'sequelize';

class Classroom extends Model {
  static init(sequelize) {
    super.init(
      {
        number_class: Sequelize.INTEGER,
        capacity_max: Sequelize.INTEGER,
        availability: Sequelize.BOOLEAN,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Teacher, {
      foreignKey: 'teacherId',
      as: 'teachers',
    });

    this.belongsToMany(models.Student, {
      through: 'student_classrooms',
      foreignKey: 'classroomId',
      as: 'classrooms',
    });
  }
}

export default Classroom;
