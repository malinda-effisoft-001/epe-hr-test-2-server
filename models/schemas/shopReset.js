module.exports = (sequelize, Sequelize) => {
  const shopReset = sequelize.define("shop_resets", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      u_date: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      u_time: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      estate_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      division_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      from_date: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      to_date: {
        type: Sequelize.STRING(32),
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

  return shopReset;
};