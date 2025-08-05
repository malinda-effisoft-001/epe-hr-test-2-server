module.exports = (sequelize, Sequelize) => {
  const job = sequelize.define("jobs", 
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
          shop_pay_type: {
              type: Sequelize.STRING(16),
              allowNull: false
          },
          shop_pay_amount: {
              type: Sequelize.FLOAT,
              allowNull: false
          },
          color: {
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

  return job;
};