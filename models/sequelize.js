const dbConfig = require("../config/dbConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
    logging: false,  
    host: dbConfig.HOST,
    dialect: 'mysql',
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle
    }
  }
);

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.userType = require("./schemas/userType")(sequelize, Sequelize);
db.user = require("./schemas/user")(sequelize, Sequelize);
db.estate = require("./schemas/estate")(sequelize, Sequelize);
db.estateUser = require("./schemas/estateUser")(sequelize, Sequelize);
db.division = require("./schemas/division")(sequelize, Sequelize);
db.divisionUser = require("./schemas/divisionUser")(sequelize, Sequelize);
db.shop = require("./schemas/shop")(sequelize, Sequelize);
db.shopUser = require("./schemas/shopUser")(sequelize, Sequelize);
db.medicalCenter = require("./schemas/medicalCenter")(sequelize, Sequelize);
db.medicalCenterUser = require("./schemas/medicalCenterUser")(sequelize, Sequelize);
db.employeeType = require("./schemas/employeeType")(sequelize, Sequelize);
db.employee = require("./schemas/employee")(sequelize, Sequelize);
db.employeeWeight = require("./schemas/employeeWeight")(sequelize, Sequelize);
db.job = require("./schemas/job")(sequelize, Sequelize);
db.periodAttendance = require("./schemas/periodAttendance")(sequelize, Sequelize);
db.periodAttendancesItem = require("./schemas/periodAttendancesItem")(sequelize, Sequelize);
db.shopAccount = require("./schemas/shopAccount")(sequelize, Sequelize);
db.shopDebit = require("./schemas/shopDebit")(sequelize, Sequelize);
db.shopDebitsItem = require("./schemas/shopDebitsItem")(sequelize, Sequelize);
db.shopCredit = require("./schemas/shopCredit")(sequelize, Sequelize);
db.salaryAdvance = require("./schemas/salaryAdvance")(sequelize, Sequelize);
db.loan = require("./schemas/loan")(sequelize, Sequelize);
db.loansItem = require("./schemas/loansItem")(sequelize, Sequelize);
db.shopReset = require("./schemas/shopReset")(sequelize, Sequelize);
db.shopResetsItem = require("./schemas/shopResetsItem")(sequelize, Sequelize);
db.menu = require("./schemas/menu")(sequelize, Sequelize);
db.foodOrder = require("./schemas/foodOrder")(sequelize, Sequelize);

db.userType.hasMany(db.user);
db.user.belongsTo(db.userType);

db.estate.hasMany(db.estateUser);
db.estateUser.belongsTo(db.estate);
db.user.hasMany(db.estateUser);
db.estateUser.belongsTo(db.user);
db.userType.hasMany(db.estateUser);
db.estateUser.belongsTo(db.userType);

db.estate.hasMany(db.division);
db.division.belongsTo(db.estate);
db.division.hasMany(db.divisionUser);
db.divisionUser.belongsTo(db.division);
db.user.hasMany(db.divisionUser);
db.divisionUser.belongsTo(db.user);
db.userType.hasMany(db.divisionUser);
db.divisionUser.belongsTo(db.userType);

db.estate.hasMany(db.shop);
db.shop.belongsTo(db.estate);
db.division.hasMany(db.shop);
db.shop.belongsTo(db.division);
db.shop.hasMany(db.shopUser);
db.shopUser.belongsTo(db.shop);
db.user.hasMany(db.shopUser);
db.shopUser.belongsTo(db.user);
db.userType.hasMany(db.shopUser);
db.shopUser.belongsTo(db.userType);

db.estate.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.estate);
db.division.hasMany(db.medicalCenter);
db.medicalCenter.belongsTo(db.division);
db.medicalCenter.hasMany(db.medicalCenterUser);
db.medicalCenterUser.belongsTo(db.medicalCenter);
db.user.hasMany(db.medicalCenterUser);
db.medicalCenterUser.belongsTo(db.user);
db.userType.hasMany(db.medicalCenterUser);
db.medicalCenterUser.belongsTo(db.userType);

db.employeeType.hasMany(db.employee);
db.employee.belongsTo(db.employeeType);
db.estate.hasMany(db.employee);
db.employee.belongsTo(db.estate);
db.division.hasMany(db.employee);
db.employee.belongsTo(db.division);
db.employee.hasMany(db.employeeWeight);
db.employeeWeight.belongsTo(db.employee);

db.user.hasMany(db.foodOrder);
db.foodOrder.belongsTo(db.user);
db.estate.hasMany(db.foodOrder);
db.foodOrder.belongsTo(db.estate);
db.division.hasMany(db.foodOrder);
db.foodOrder.belongsTo(db.division);
db.employee.hasMany(db.foodOrder);
db.foodOrder.belongsTo(db.employee);
db.menu.hasMany(db.foodOrder);
db.foodOrder.belongsTo(db.menu);

db.job.hasMany(db.periodAttendance);
db.periodAttendance.belongsTo(db.job);
db.user.hasMany(db.periodAttendance);
db.periodAttendance.belongsTo(db.user);
db.estate.hasMany(db.periodAttendance);
db.periodAttendance.belongsTo(db.estate);
db.division.hasMany(db.periodAttendance);
db.periodAttendance.belongsTo(db.division);
db.periodAttendance.hasMany(db.periodAttendancesItem);
db.periodAttendancesItem.belongsTo(db.periodAttendance);

db.job.hasMany(db.periodAttendancesItem);
db.periodAttendancesItem.belongsTo(db.job);
db.estate.hasMany(db.periodAttendancesItem);
db.periodAttendancesItem.belongsTo(db.estate);
db.division.hasMany(db.periodAttendancesItem);
db.periodAttendancesItem.belongsTo(db.division);
db.employee.hasMany(db.periodAttendancesItem);
db.periodAttendancesItem.belongsTo(db.employee);

db.user.hasMany(db.shopAccount);
db.shopAccount.belongsTo(db.user);
db.estate.hasMany(db.shopAccount);
db.shopAccount.belongsTo(db.estate);
db.division.hasMany(db.shopAccount);
db.shopAccount.belongsTo(db.division);
db.job.hasMany(db.shopAccount);
db.shopAccount.belongsTo(db.job);
db.employee.hasMany(db.shopAccount);
db.shopAccount.belongsTo(db.employee);

db.job.hasMany(db.shopDebit);
db.shopDebit.belongsTo(db.job);
db.user.hasMany(db.shopDebit);
db.shopDebit.belongsTo(db.user);
db.estate.hasMany(db.shopDebit);
db.shopDebit.belongsTo(db.estate);
db.division.hasMany(db.shopDebit);
db.shopDebit.belongsTo(db.division);
db.shopDebit.hasMany(db.shopDebitsItem);
db.shopDebitsItem.belongsTo(db.shopDebit);

db.job.hasMany(db.shopDebitsItem);
db.shopDebitsItem.belongsTo(db.job);
db.estate.hasMany(db.shopDebitsItem);
db.shopDebitsItem.belongsTo(db.estate);
db.division.hasMany(db.shopDebitsItem);
db.shopDebitsItem.belongsTo(db.division);
db.employee.hasMany(db.shopDebitsItem);
db.shopDebitsItem.belongsTo(db.employee);

db.user.hasMany(db.shopCredit);
db.shopCredit.belongsTo(db.user);
db.estate.hasMany(db.shopCredit);
db.shopCredit.belongsTo(db.estate);
db.division.hasMany(db.shopCredit);
db.shopCredit.belongsTo(db.division);
db.shop.hasMany(db.shopCredit);
db.shopCredit.belongsTo(db.shop);
db.employee.hasMany(db.shopCredit);
db.shopCredit.belongsTo(db.employee);

db.user.hasMany(db.salaryAdvance);
db.salaryAdvance.belongsTo(db.user);
db.estate.hasMany(db.salaryAdvance);
db.salaryAdvance.belongsTo(db.estate);
db.division.hasMany(db.salaryAdvance);
db.salaryAdvance.belongsTo(db.division);
db.employee.hasMany(db.salaryAdvance);
db.salaryAdvance.belongsTo(db.employee);

db.user.hasMany(db.loan);
db.loan.belongsTo(db.user);
db.estate.hasMany(db.loan);
db.loan.belongsTo(db.estate);
db.division.hasMany(db.loan);
db.loan.belongsTo(db.division);
db.employee.hasMany(db.loan);
db.loan.belongsTo(db.employee);

db.user.hasMany(db.loansItem);
db.loansItem.belongsTo(db.user);
db.estate.hasMany(db.loansItem);
db.loansItem.belongsTo(db.estate);
db.division.hasMany(db.loansItem);
db.loansItem.belongsTo(db.division);

db.user.hasMany(db.shopReset);
db.shopReset.belongsTo(db.user);
db.estate.hasMany(db.shopReset);
db.shopReset.belongsTo(db.estate);
db.division.hasMany(db.shopReset);
db.shopReset.belongsTo(db.division);
db.shopReset.hasMany(db.shopResetsItem);
db.shopResetsItem.belongsTo(db.shopReset);

db.estate.hasMany(db.shopResetsItem);
db.shopResetsItem.belongsTo(db.estate);
db.division.hasMany(db.shopResetsItem);
db.shopResetsItem.belongsTo(db.division);
db.employee.hasMany(db.shopResetsItem);
db.shopResetsItem.belongsTo(db.employee);

module.exports = db;