module.exports = (sequelize, Sequelize) => {
  const foodOrder = sequelize.define("food_orders", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      u_date: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      u_time: {
        type: Sequelize.STRING(32),
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
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      food_pay_type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      menu_weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      weight: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      food_pay_type: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },
      pay_status: {
        type: Sequelize.STRING(32),
        allowNull: false,
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

  return foodOrder;
};