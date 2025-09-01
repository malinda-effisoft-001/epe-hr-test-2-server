const db = require('../../models/sequelize');
const Sequelize = require("sequelize");
const shopReset = db.shopReset;
const Op = db.Sequelize.Op;

exports.search = async (req, rpp, page, callBack) => {
  let order = [[req.sort_by, req.order]];
  let where = {};
  if(req.from!==undefined && req.to!==undefined){
    where = {
      [Op.and]:[
        {
          from_date: {
            [Op.between]: [req.from, req.to]
          }
        },
        {
          to_date: {
            [Op.between]: [req.from, req.to]
          }
        }
      ]
    };
  }
  else if(req.from!==undefined){
    where = {
      [Op.and]:[
        {
          from_date: {
            [Op.gte]: [req.from]
          }
        },
        {
          to_date: {
            [Op.gte]: [req.from]
          }
        }
      ]
    };
  }
  else if(req.to!==undefined){
    where = {
      [Op.and]:[
        {
          from_date: {
            [Op.lte]: [req.to]
          }
        },
        {
          to_date: {
            [Op.lte]: [req.to]
          }
        }
      ]
    };
  }
  if(req.user_id!==undefined){
    where.user_id = req.user_id;
  }
  if(req.estate_id!==undefined){
    where.estate_id = req.estate_id;
  }
  if(req.division_id!==undefined){
    where.division_id = req.division_id;
  }
  if(req.status!==undefined){
    where.status = req.status;
  }
  if(req.user_type===5){
    where.user_id = req.user_id_1;
  }
  if(req.user_type===6 || req.user_type===7 || req.user_type===8 || req.user_type===9 || req.user_type===10){
    where.id = {
      [Op.in]: [0]
    };
  }
  if(rpp===0){
      shopReset.findAndCountAll({
      attributes: ['id', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'status'],
      include: [
        {
          model: db.user,
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: db.estate,
          attributes: ['id', 'description', 'color']
        },
        {
          model: db.division,
          attributes: ['id', 'description', 'color']
        },
      ],
      where: where,
      order: order,
    })
    .then(data=>{
      var rowCount = data.rows.length;
      var numOfPages = Math.ceil(rowCount/rpp);
      if(numOfPages == 0){
        numOfPages = 1;
      }
      if(page > numOfPages){
        page = numOfPages;
      }
      var data1 ={
        data: data.rows,
        row_count: rowCount,
        nop: numOfPages
      };
      callBack({error:false, data:data1, errorMessage:""});
    })
    .catch(err=>{
      callBack({error:true, data:null, errorMessage:''});
    });
  }
  else{
    try{
      const { count, rows } = await shopReset.findAndCountAll({
        attributes: ['id', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'status'],
        include: [
          {
            model: db.user,
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: db.estate,
            attributes: ['id', 'description', 'color']
          },
          {
            model: db.division,
            attributes: ['id', 'description', 'color']
          },
        ],
        where: where,
        order: order,
        limit: rpp,
        offset: (page-1)*rpp
      });
      var numOfPages = Math.ceil(count/rpp);
      if(numOfPages == 0){
        numOfPages = 1;
      }
      if(page > numOfPages){
        page = numOfPages;
      }
      var data1 ={
        data: rows,
        row_count: count,
        nop: numOfPages
      };
      callBack({error:false, data:data1, errorMessage:""});
    }
    catch(err){
      callBack({error:true, data:null, errorMessage:""});
    }
  }
};

exports.findOne = (req, callBack) => {
  shopReset.findOne({
    attributes: ['id', 'u_date', 'u_time', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'status'],
    include: [
      {
        model: db.user,
        attributes: ['id', 'first_name', 'last_name']
      },
      {
        model: db.estate,
        attributes: ['id', 'description', 'color']
      },
      {
        model: db.division,
        attributes: ['id', 'description', 'color']
      },
      {
        model: db.shopDebitsItem,
        attributes: ['id', 'employee_id', 'from_date', 'to_date', 'days', 'amount', 'food_payments', 'advances', 'purchases', 'loans'],
        include: [
          {
            model: db.estate,
            attributes: ['id', 'description', 'color']
          },
          {
            model: db.division,
            attributes: ['id', 'description', 'color']
          },
          {
            model: db.employee,
            attributes: ['id', 'epf_no', 'first_name', 'last_name']
          },
        ],
      },
    ],
    where: {
      id: req.id
    }
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.getDebits = (req, callBack) => {
  var where = {
    [Op.and]:[
      {
        from_date: {
          [Op.between]: [req.from_date, req.to_date]
        }
      },
      {
        to_date: {
          [Op.between]: [req.from_date, req.to_date]
        }
      }
    ]
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  db.shopDebitsItem.findAndCountAll({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('days')), 'days'], [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name'],
      },
    ],
    group: ['employee_id'],
    order: ['employee_id'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:[], errorMessage:""});
  });
};

exports.getAdvances = (req, callBack) => {
  var where = {
    u_date: {
      [Op.between]: [req.from_date, req.to_date]
    }
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  db.salaryAdvance.findAndCountAll({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name'],
      },
    ],
    group: ['employee_id'],
    order: ['employee_id'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:[], errorMessage:""});
  });
};

exports.getPurchases = (req, callBack) => {
  var where = {
    u_date: {
      [Op.between]: [req.from_date, req.to_date]
    }
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  db.shopCredit.findAndCountAll({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name'],
      },
    ],
    group: ['employee_id'],
    order: ['employee_id'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:[], errorMessage:""});
  });
};

exports.getFoodOrders = (req, callBack) => {
  var where = {
    u_date: {
      [Op.between]: [req.from_date, req.to_date]
    }
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  where.status = 'issued';
  where.pay_status = 'pending';
  db.foodOrder.findAndCountAll({
    attributes: ['employee_id', 'menu_id'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name'],
      },
      {
        model: db.menu,
        attributes: ['amount'],
      },
    ],
    order: ['employee_id'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:[], errorMessage:""});
  });
};

exports.reset = (req, callBack) => {
  var where = {
    [Op.and]:[
      {
        from_date: {
          [Op.between]: [req.from_date, req.to_date]
        }
      },
      {
        to_date: {
          [Op.between]: [req.from_date, req.to_date]
        }
      }
    ]
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  db.shopDebitsItem.findAndCountAll({
    attributes: [[Sequelize.fn('SUM', Sequelize.col('days')), 'days'], [Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name'],
      },
    ],
    group: ['employee_id'],
    order: ['employee_id'],
    where: where
  })
  .then(data=>{
    var data_in = [];
    data.rows.map(val=>{
      var temp = {
        id: val.employee_id,
        epf_no: val.employee.epf_no,
        description: val.employee.first_name+' '+val.employee.last_name,
        debits: val.amount,
        advances: 0.0,
        purchases: 0.0,
        food_orders: [],
        food_orders_amount: 0.0,
        loans: 0.0,
        total: val.amount,
      };
      data_in.push(temp);
    });
    where = {
      u_date: {
        [Op.between]: [req.from_date, req.to_date]
      }
    };
    where.estate_id = req.estate_id;
    where.division_id = req.division_id;
    db.salaryAdvance.findAndCountAll({
      attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
      include: [
        {
          model: db.employee,
          attributes: ['id', 'epf_no', 'first_name', 'last_name'],
        },
      ],
      group: ['employee_id'],
      order: ['employee_id'],
      where: where
    })
    .then(data1=>{
      data1.rows.map(val=>{
        var found = false;
        for(var i=0; i<data_in.length; i++){
          if(val.employee_id===data_in[i].id){
            data_in[i].advances = val.amount;
            data_in[i].total = data_in[i].total - val.amount;
            found = true;
            i = data_in.length;
          }
        }
        if(!found){
          var temp = {
            id: val.employee_id,
            epf_no: val.employee.epf_no,
            description: val.employee.first_name+' '+val.employee.last_name,
            debits: 0.0,
            advances: val.amount,
            purchases: 0.0,
            food_orders: [],
            food_orders_amount: 0.0,
            loans: 0.0,
            total: val.amount * -1,
          };
          data_in.push(temp);
        }
      });
      db.shopCredit.findAndCountAll({
        attributes: [[Sequelize.fn('SUM', Sequelize.col('amount')), 'amount'], 'employee_id'],
        include: [
          {
            model: db.employee,
            attributes: ['id', 'epf_no', 'first_name', 'last_name'],
          },
        ],
        group: ['employee_id'],
        order: ['employee_id'],
        where: where
      })
      .then(data2=>{
        data2.rows.map(val=>{
          var found = false;
          for(var i=0; i<data_in.length; i++){
            if(val.employee_id===data_in[i].id){
              data_in[i].purchases = val.amount;
              data_in[i].total = data_in[i].total - val.amount;
              found = true;
              i = data_in.length;
            }
          }
          if(!found){
            var temp = {
              id: val.employee_id,
              epf_no: val.employee.epf_no,
              description: val.employee.first_name+' '+val.employee.last_name,
              debits: 0.0,
              advances: 0.0,
              purchases: val.amount,
              food_orders: [],
              food_orders_amount: 0.0,
              loans: 0.0,
              total: val.amount * -1,
            };
            data_in.push(temp);
          }
        });
        where.status = 'issued';
        where.pay_status = 'pending';
        db.foodOrder.findAndCountAll({
          attributes: ['id', 'employee_id', 'menu_id'],
          include: [
            {
              model: db.employee,
              attributes: ['epf_no', 'first_name', 'last_name'],
            },
            {
              model: db.menu,
              attributes: ['amount'],
            },
          ],
          order: ['employee_id'],
          where: where
        })
        .then(data3=>{
          var values = [];
          data3.rows.map(val=>{
            var found = false;
            for(var i=0; i<values.length; i++){
              if(val.employee_id===values[i].id){
                values[i].food_orders_amount = values[i].food_orders_amount + val.menu.amount;
                values[i].food_orders.push(val.id);
                found = true;
                i = values.length;
              }
            }
            if(!found){
              var temp = [];
              temp.push(val.id);
              var temp1 = {
                id: val.employee_id,
                epf_no: val.employee.epf_no,
                description: val.employee.first_name+' '+val.employee.last_name,
                food_orders_amount: val.menu.amount,
                food_orders: temp,
              };
              values.push(temp1);
            }
          });
          values.map(val=>{
            var found = false;
            for(var i=0; i<data_in.length; i++){
              if(val.id===data_in[i].id){
                data_in[i].food_orders_amount = val.food_orders_amount;
                data_in[i].food_orders = val.food_orders;
                data_in[i].total = data_in[i].total - val.food_orders_amount;
                found = true;
                i = data_in.length;
              }
            }
            if(!found){
              var temp = {
                id: val.id,
                epf_no: val.epf_no,
                description: val.description,
                debits: 0.0,
                advances: 0.0,
                purchases: 0.0,
                food_orders_amount: val.food_orders_amount,
                food_orders: val.food_orders,
                loans: 0.0,
                total: val.food_orders_amount * -1,
              };
              data_in.push(temp);
            }
          });
          if(data_in.length===0){
            callBack({error:false, data:'no_data', errorMessage:""});
          }
          else{
            var u_date = getDate();
            var u_time = getTime();
            shopReset.create({
              u_date: u_date,
              u_time: u_time,
              user_id: req.user_id,
              estate_id: req.estate_id,
              division_id: req.division_id,
              from_date: req.from_date,
              to_date: req.to_date,
              status: 'finalized'
            })
            .then(data4=>{
              var shop_reset_id = data4.id;
              var result = {id: shop_reset_id, u_date: u_date, u_time: u_time, status: 'finalized'};
              var feedBack = [];
              for(let i=0; i<data_in.length; i++){
                var temp = data_in[i];
                let retPromise = createItem(shop_reset_id, req.user_id, req.estate_id, req.division_id, req.from_date, req.to_date, temp);
                retPromise.then(response1=>{
                  var feed_back_temp = {};
                  feed_back_temp.id = response1.data;
                  feed_back_temp.error = false;
                  feed_back_temp.errorMsg = '';
                  feed_back_temp.status = 'done';
                  feedBack.push(feed_back_temp);
                  if(feedBack.length===data_in.length){
                    callBack({error:false, data:{result, feedBack}, errorMessage:''});
                  }
                }).catch(error1=>{
                  var feed_back_temp = {};
                  feed_back_temp.id = error1.data;
                  feed_back_temp.error = true;
                  feed_back_temp.errorMsg = error1.errorMsg;
                  feed_back_temp.status = 'error';
                  feedBack.push(feed_back_temp);
                  if(feedBack.length===data_in.length){
                    callBack({error:false, data:{result, feedBack}, errorMessage:''});
                  }
                });
              }
            })
            .catch(err4=>{
              callBack({error:true, data:null, errorMessage:''});
            });
          }
        })
        .catch(err3=>{
          callBack({error:true, data:[], errorMessage:""});
        });
      })
      .catch(err2=>{
        callBack({error:true, data:[], errorMessage:""});
      });
    })
    .catch(err1=>{
      callBack({error:true, data:[], errorMessage:""});
    });
  })
  .catch(err=>{
    callBack({error:true, data:[], errorMessage:""});
  });
};

function createItem(shop_reset_id, user_id, estate_id, division_id, from_date, to_date, item){
  return new Promise((resolve, reject)=>{
    var u_date = getDate();
    var u_time = getTime();
    db.shopResetsItem.create({
      shop_reset_id: shop_reset_id,
      estate_id: estate_id,
      division_id: division_id,
      from_date: from_date,
      to_date: to_date,
      employee_id: item.id,
      debits: item.debits,
      food_payments: item.food_orders_amount,
      advances: item.advances,
      purchases: item.purchases,
      loans: item.loans,
    })
    .then(data=>{
      db.shopAccount.findAll({
        attributes: ['id', 'balance'],
        limit: 1,
        where: {
          employee_id: item.id
        },
        order: [ [ 'id', 'DESC' ]]
      })
      .then(data1=>{
        var credit = item.total;
        var debit = 0.0;
        var balance = 0.0;
        if(data1.length>0){
          var balance = data1[0].balance;
        }
        balance = balance - credit;
        db.shopAccount.create({
          user_id: user_id,
          u_date: u_date,
          u_time: u_time,
          estate_id: estate_id,
          division_id: division_id,
          employee_id: item.id,
          tra_description: 'Reset',
          tra_ref: shop_reset_id,
          tra_item_ref: data.id,
          tra_type: 'CREDIT',
          credit: credit,
          debit: debit,
          balance: balance,
          status: 'issued'
        })
        .then(data2=>{
          var food_orders = item.food_orders;
          var feedBack1 = [];
          if(food_orders.length===0){
            resolve({error: false, data: item.id});
          }
          else{
            for(let j=0; j<food_orders.length; j++){
              var temp1 = food_orders[j];
              let retPromise1 = editFoodOrder(temp1);
              retPromise1.then(response2=>{
                feedBack1.push(response2.data);
                if(feedBack1.length===food_orders.length){
                  resolve({error: false, data: item.id});
                }
              }).catch(error2=>{
                feedBack1.push(error2.data);
                if(feedBack1.length===food_orders.length){
                  reject({error: true, data: item.id, error: 'Server Error'});
                }
              });
            }
          }
        })
        .catch(err2=>{
          reject({error: true, data: item.id, error: 'Server Error'});
        });
      })
      .catch(err1=>{
        reject({error: true, data: item.id, error: 'Server Error'});
      });
    })
    .catch(err=>{
      reject({error: true, data: item.id, errorMsg: 'Server Error'});
    });
  });
};

function editFoodOrder(id){
  return new Promise((resolve, reject)=>{
    db.foodOrder.update(
      {
        pay_status: 'paid'
      }, 
      {
        where: {
          id: id
        }
      }
    )
    .then(data=>{
      resolve({error: false, data: id});
    })
    .catch(err=>{
      reject({error: true, data: id, error: 'Server Error'});
    });
  });
};

function getDate(){
  var d = new Date();
  var date = [
    d.getFullYear(),
    ('0' + (d.getMonth() + 1)).slice(-2),
    ('0' + d.getDate()).slice(-2)
  ].join('-');
    return date;
}

function getTime(){
  var d = new Date();
  var time = d.toLocaleTimeString();
  return time;
}