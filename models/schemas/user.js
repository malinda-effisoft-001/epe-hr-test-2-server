module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("users", 
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true
          },
          user_type_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          code: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          barcode: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          first_name: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          last_name: {
              type: Sequelize.STRING(64),
              allowNull: false
          },
          phone: {
              type: Sequelize.STRING(64),
              allowNull: false
          },
          email: {
              type: Sequelize.STRING(64),
              allowNull: false
          },
          address: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          password: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          image_url: {
              type: Sequelize.STRING(128),
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
  
  return user;
};