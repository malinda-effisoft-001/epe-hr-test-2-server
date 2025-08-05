module.exports = (sequelize, Sequelize) => {
  const loansItem = sequelize.define("loans_items", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      loan_id: {
        type: Sequelize.INTEGER,
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
      u_date: {
        type: Sequelize.STRING(32),
        allowNull: false
      },
      u_time: {
        type: Sequelize.STRING(32),
        allowNull: false
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

  return loansItem;
};