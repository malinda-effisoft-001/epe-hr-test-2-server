module.exports = (sequelize, Sequelize) => {
  const shopResetsItem = sequelize.define("shop_resets_items", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      shop_reset_id: {
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
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      debits: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      food_payments: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      advances: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      purchases: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      loans: {
        type: Sequelize.FLOAT,
        allowNull: false,
      }
    }, 
    {
      freezeTableName: true,
      underscored: true
    }
  );

  return shopResetsItem;
};