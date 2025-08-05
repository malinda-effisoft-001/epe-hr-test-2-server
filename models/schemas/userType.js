module.exports = (sequelize, Sequelize) => {
  const userType = sequelize.define("user_types", 
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true
          },
          description: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          status: {
              type: Sequelize.STRING(16),
              allowNull: false
          }
      }, 
      {
          freezeTableName: true,
          underscored: true
      }
  );

  return userType;
};