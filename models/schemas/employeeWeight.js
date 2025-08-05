module.exports = (sequelize, Sequelize) => {
  const employeeWeight = sequelize.define("employee_weights", 
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      balance: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    }, 
    {
      freezeTableName: true,
      underscored: true
    }
  );

  return employeeWeight;
};