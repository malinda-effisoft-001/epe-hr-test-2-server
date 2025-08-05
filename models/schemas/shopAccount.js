module.exports = (sequelize, Sequelize) => {
  const shopAccount = sequelize.define("shop_accounts", 
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
      tra_description: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      tra_ref: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tra_item_ref: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tra_type: {
        type: Sequelize.STRING(16),
        allowNull: false
      },
      credit: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      debit: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      balance: {
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

  return shopAccount;
};