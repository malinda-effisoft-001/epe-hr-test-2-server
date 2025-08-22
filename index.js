var path = require('path');
global.appRoot = path.resolve(__dirname);
require('dotenv').config({path: appRoot+'/.env'});
var http = require('http');
var express = require('express');
const cors = require('cors');
const db = require("./models/sequelize");

const app = express();
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
db.sequelize.sync();

app.get('/', (req, res) => res.send('epe-hr-test-2-server running!!!!!!!'));

const usersRoute = require('./routers/entities/users');
const estatesRoute = require('./routers/entities/estates');
const divisionsRoute = require('./routers/entities/divisions');
const shopsRoute = require('./routers/hr/shops');
const medicalCentersRoute = require('./routers/hr/medicalCenters');
const employeeTypesRoute = require('./routers/hr/employeeTypes');
const employeesRoute = require('./routers/hr/employees');
const jobsRoute = require('./routers/hr/jobs');
const menusRoute = require('./routers/hr/menus');
const foodOrdersRoute = require('./routers/hr/foodOrders');
const periodAttendanceRoute = require('./routers/hr/periodAttendance');
const shopDebitsRoute = require('./routers/hr/shopDebits');
const shopCreditsRoute = require('./routers/hr/shopCredits');
const salaryAdvancesRoute = require('./routers/hr/salaryAdvances');

app.use('/users', usersRoute);
app.use('/estates', estatesRoute);
app.use('/divisions', divisionsRoute);
app.use('/shops', shopsRoute);
app.use('/medical-centers', medicalCentersRoute);
app.use('/employee-types', employeeTypesRoute);
app.use('/employees', employeesRoute);
app.use('/jobs', jobsRoute);
app.use('/menus', menusRoute);
app.use('/food-orders', foodOrdersRoute);
app.use('/period-attendance', periodAttendanceRoute);
app.use('/shop-debits', shopDebitsRoute);
app.use('/shop-credits', shopCreditsRoute);
app.use('/salary-advances', salaryAdvancesRoute);

app.use("/uploads/images/users", express.static(path.join(__dirname+"/uploads/images/users")));
app.use("/uploads/images/estates", express.static(path.join(__dirname+"/uploads/images/estates")));
app.use("/uploads/images/divisions", express.static(path.join(__dirname+"/uploads/images/divisions")));
app.use("/uploads/images/shops", express.static(path.join(__dirname+"/uploads/images/shops")));
app.use("/uploads/images/medical-centers", express.static(path.join(__dirname+"/uploads/images/medical-centers")));
app.use("/uploads/images/employees", express.static(path.join(__dirname+"/uploads/images/employees")));

const server = http.createServer(app);
const PORT = process.env.PORT;

server.listen(PORT, () => {
  console.log(`Listening to requests on : ${PORT}`);
});