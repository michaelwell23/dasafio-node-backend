import Sequelize, { Model } from 'sequelize';

class Teacher extends Model {
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
    this.hasMany(models.Classroom, {
      foreignKey: 'teacherId',
      as: 'teachers',
    });
  }
}

export default Teacher;
