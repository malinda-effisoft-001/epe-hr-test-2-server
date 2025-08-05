const db = require('../../models/sequelize');
const shopDebit = db.shopDebit;
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
  if(req.job_id!==undefined){
    where.job_id = req.job_id;
  }
  if(req.status!==undefined){
    where.status = req.status;
  }
  if(rpp===0){
      shopDebit.findAndCountAll({
      attributes: ['id', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'job_id', 'status'],
      include: [
        {
          model: db.user,
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: db.job,
          attributes: ['id', 'description', 'color']
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
      const { count, rows } = await shopDebit.findAndCountAll({
        attributes: ['id', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'job_id', 'status'],
        include: [
          {
            model: db.user,
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: db.job,
            attributes: ['id', 'description', 'color']
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
  shopDebit.findOne({
    attributes: ['id', 'u_date', 'u_time', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'job_id', 'shop_pay_type', 'shop_pay_amount', 'status'],
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
        model: db.job,
        attributes: ['id', 'description', 'color']
      },
      {
        model: db.shopDebitsItem,
        attributes: ['id', 'employee_id', 'from_date', 'to_date', 'days', 'amount', 'status'],
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
            model: db.job,
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

exports.issue = (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  let where = {
    [Op.and]:[
      {
        from_date: {
          [Op.eq]: [req.from_date]
        }
      },
      {
        to_date: {
          [Op.eq]: [req.to_date]
        }
      }
    ]
  };
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  where.job_id = req.job_id;
  where.status = 'done';
  db.periodAttendancesItem.findAndCountAll({
    attributes: ['id', 'employee_id', 'days', 'ot', 'weight'],
    include: [
      {
        model: db.employee,
        attributes: ['id', 'epf_no']
      },
    ],
    where: where
  })
  .then(data=>{
    if(data.rows.length>0){
      shopDebit.create({
        u_date: u_date,
        u_time: u_time,
        user_id: req.user_id,
        estate_id: req.estate_id,
        division_id: req.division_id,
        job_id: req.job_id,
        from_date: req.from_date,
        to_date: req.to_date,
        shop_pay_type: req.shop_pay_type,
        shop_pay_amount: req.shop_pay_amount,
        status: 'finalized'
      })
      .then(data1=>{
        var shop_debit_id = data1.id;
        var result = {id: data1.id, u_date: u_date, u_time: u_time, status: 'finalized'};

        var values = [];
        var feedBack = [];
        for(var i=0; i<data.rows.length; i++){
          var val1 = data.rows[i];
          var found = false;
          var index = -1;
          for(var j=0; j<values.length; j++){
            var val2 = values[j];
            if(val1.employee_id===val2.employee_id){
              found = true;
              index = j;
            }
          }
          if(found){
            var days = parseFloat(''+values[index].days) + parseFloat(''+val1.days);
            var val3 = {
              id: values[index].id,
              employee_id: values[index].employee_id,
              epf_no: values[index].epf_no,
              days: days,
            };
            values[index] = val3;
          }
          else{
            var val3 = {
              id: val1.id,
              employee_id: val1.employee_id,
              epf_no: val1.employee.epf_no,
              days: val1.days,
            };
            values.push(val3);
          }
        }

        for(let i=0; i<values.length; i++){
          var temp = values[i];
          let retPromise = createItem(shop_debit_id, req.user_id, req.estate_id, req.division_id, req.from_date, req.to_date, req.job_id, req.shop_pay_type, req.shop_pay_amount, temp);
          retPromise.then(res=>{
            var feed_back_temp = {};
            feed_back_temp.epf_no = res.data;
            feed_back_temp.error = false;
            feed_back_temp.errorMsg = '';
            feed_back_temp.status = 'done';
            feedBack.push(feed_back_temp);
            if(feedBack.length===values.length){
              callBack({error:false, data:{result, feedBack}, errorMessage:''});
            }
          }).catch(err=>{
            var feed_back_temp = {};
            feed_back_temp.epf_no = err.data;
            feed_back_temp.error = true;
            feed_back_temp.errorMsg = err.errorMsg;
            feed_back_temp.status = 'error';
            feedBack.push(feed_back_temp);
            if(feedBack.length===values.length){
              callBack({error:false, data:{result, feedBack}, errorMessage:''});
            }
          });
        }
      })
      .catch(err1=>{
        callBack({error:true, data:null, errorMessage:''});
      });
    }
    else{
      callBack({error:true, data:'no_data', errorMessage:''});
    }
  })
  .catch(err=>{
    callBack({error:false, data:[], errorMessage:""});
  });
};

function createItem(shop_debit_id, user_id, estate_id, division_id, from_date, to_date, job_id, shop_pay_type, shop_pay_amount, item){
  return new Promise((resolve, reject)=>{
    var u_date = getDate();
    var u_time = getTime();
    var amount = 0.0;
    if(shop_pay_type==='day'){              
      amount = item.days*parseFloat(shop_pay_amount);
    }
    else if(shop_pay_type==='month'){
      amount = parseFloat(shop_pay_amount);
    }
    if(amount<=0.0){
      reject({error: true, data: item.epf_no, error: 'Inavlid Amount'});
    }
    else{
      db.shopDebitsItem.create({
        shop_debit_id: shop_debit_id,
        from_date: from_date,
        to_date: to_date,
        estate_id: estate_id,
        division_id: division_id,
        job_id: job_id,
        employee_id: item.employee_id,
        days: item.days,
        amount: amount,
        status: 'done',
      })
      .then(data=>{
        db.shopAccount.findAll({
          attributes: ['id', 'balance'],
          limit: 1,
          where: {
            employee_id: item.employee_id
          },
          order: [ [ 'id', 'DESC' ]]
        })
        .then(data1=>{
          var credit = 0.0;
          var debit = amount;
          var balance = 0.0;
          if(data1.length>0){
            var balance = data1[0].balance;
          }
          balance = balance + amount;
          db.shopAccount.create({
            user_id: user_id,
            u_date: u_date,
            u_time: u_time,
            estate_id: estate_id,
            division_id: division_id,
            employee_id: item.employee_id,
            tra_description: 'Shop Debit',
            tra_ref: shop_debit_id,
            tra_item_ref: data.id,
            tra_type: 'DEBIT',
            credit: credit,
            debit: debit,
            balance: balance,
            status: 'issued'
          })
          .then(data2=>{
            db.periodAttendancesItem.update(
              {
                status: 'paid'
              }, 
              {
                where: {
                  id: item.id
                }
              }
            )
            .then(data3=>{
              resolve({error: false, data: item.epf_no});
            })
            .catch(err3=>{
              reject({error: true, data: item.epf_no, error: 'Server Error'});
            });
          })
          .catch(err2=>{
            reject({error: true, data: item.epf_no, error: 'Server Error'});
          });
        })
        .catch(err1=>{
          reject({error: true, data: item.epf_no, error: 'Server Error'});
        });
      })
      .catch(err=>{
        reject({error: true, data: item.epf_no, errorMsg: 'Server Error'});
      });
    }
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