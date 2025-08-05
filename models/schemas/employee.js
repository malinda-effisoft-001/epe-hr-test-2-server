module.exports = (sequelize, Sequelize) => {
  const user = sequelize.define("employees", 
      {
          id: {
              type: Sequelize.INTEGER,
              primaryKey: true,
              allowNull: false,
              autoIncrement: true
          },
          employee_type_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          pay_type: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          estate_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          division_id: {
              type: Sequelize.INTEGER,
              allowNull: false
          },
          allow_credit: {
              type: Sequelize.STRING(8),
              allowNull: false
          },
          zone_code: {
              type: Sequelize.STRING(64),
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
          epf_no: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          initials: {
              type: Sequelize.STRING(32),
              allowNull: false
          },
          first_name: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          last_name: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          phone: {
              type: Sequelize.STRING(64),
              allowNull: false
          },
          email: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          address: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          dob: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          nic: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          gender: {
              type: Sequelize.STRING(16),
              allowNull: false
          },
          start_date: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          end_date: {
              type: Sequelize.STRING(128),
              allowNull: false
          },
          vegetarian: {
              type: Sequelize.STRING(8),
              allowNull: false
          },
          food_pay_type: {
              type: Sequelize.STRING(32),
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