module.exports = (sequelize, Sequelize) => {
  const shopUser = sequelize.define("shop_users", 
      {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        shop_id: {
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

  return shopUser;
};