module.exports = (sequelize, Sequelize) => {
  const medicalCenterUser = sequelize.define("medical_center_users", 
      {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        medical_center_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_type_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING(32),
            allowNull: false,
        }
      }, 
      {
          freezeTableName: true,
          underscored: true
      }
  );

  return medicalCenterUser;
};