module.exports = (sequelize, Sequelize) => {
  const employeeType = sequelize.define("employee_types", 
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true
          },
          code: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          description: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          color: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          food: {
              type: Sequelize.STRING(8),
              allowNull: false
          },
          status: {
              type: Sequelize.STRING(32),
              allowNull: false
          }
      }, 
      {
          freezeTableName: true,
          underscored: true
      }
  );

  return employeeType;
};