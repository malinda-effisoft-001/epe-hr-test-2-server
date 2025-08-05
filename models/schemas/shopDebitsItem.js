module.exports = (sequelize, Sequelize) => {
  const shopDebitsItem = sequelize.define("shop_debits_items", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      shop_debit_id: {
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
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      days: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
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

  return shopDebitsItem;
};