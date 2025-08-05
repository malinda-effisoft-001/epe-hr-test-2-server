module.exports = (sequelize, Sequelize) => {
  const menu = sequelize.define("menus", 
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true
          },
          code: {
              type: Sequelize.STRING,
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
          weight: {
              type: Sequelize.FLOAT,
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

  return menu;
};