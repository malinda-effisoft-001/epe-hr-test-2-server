const db = require('../../models/sequelize');
const shopCredit = db.shopCredit;
const Op = db.Sequelize.Op;

exports.search = async (req, rpp, page, callBack) => {
  let order = [[req.sort_by, req.order]];
  let where = {};
  where = {
    u_date: {
      [Op.between]: [req.from, req.to]
    }
  };
  if(req.user_id!==undefined){
    where.user_id = req.user_id;
  }
  if(req.estate_id!==undefined){
    where.estate_id = req.estate_id;
  }
  if(req.division_id!==undefined){
    where.division_id = req.division_id;
  }
  if(req.employee_id!==undefined){
    where.employee_id = req.employee_id;
  }
  if(req.status!==undefined){
    where.status = req.status;
  }
  if(req.user_type===5){
    if(req.estates!==undefined){
      where.estate_id = {
        [Op.in]: req.estates
      };
    }
    if(req.divisions!==undefined){
      where.division_id = {
        [Op.in]: req.divisions
      };
    }
  }
  if(req.user_type===10){
    where.user_id = req.request_user_id;
  }
  if(rpp===0){
      shopCredit.findAndCountAll({
      attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'amount', 'status'],
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
          model: db.shop,
          attributes: ['id', 'description', 'color']
        },
        {
          model: db.employee,
          attributes: ['id', 'first_name', 'last_name', 'epf_no', 'image_url']
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
      const { count, rows } = await shopCredit.findAndCountAll({
        attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'amount', 'status'],
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
            model: db.shop,
            attributes: ['id', 'description', 'color']
          },
          {
            model: db.employee,
            attributes: ['id', 'first_name', 'last_name', 'epf_no', 'image_url']
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
  shopCredit.findOne({
    attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'amount', 'status'],
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
        model: db.shop,
        attributes: ['id', 'description', 'color']
      },
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name', 'epf_no', 'image_url']
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
  shopCredit.create({
    u_date: u_date,
    u_time: u_time,
    user_id: req.user_id,
    estate_id: req.estate_id,
    division_id: req.division_id,
    shop_id: req.shop_id,
    employee_id: req.employee_id,
    amount: req.amount,
    status: 'issued'
  })
  .then(data=>{
    var result = {id: data.id, u_date: u_date, u_time: u_time, status: 'issued'};
    db.shopAccount.findAll({
      attributes: ['id', 'balance'],
      limit: 1,
      where: {
        employee_id: req.employee_id
      },
      order: [ [ 'id', 'DESC' ]]
    })
    .then(data1=>{
      var debit = 0.0;
      var credit = req.amount;
      var balance = 0.0;
      if(data1.length>0){
        var balance = data1[0].balance;
      }
      balance = balance - req.amount;
      db.shopAccount.create({
        user_id: req.user_id,
        u_date: u_date,
        u_time: u_time,
        estate_id: req.estate_id,
        division_id: req.division_id,
        employee_id: req.employee_id,
        tra_description: 'Shop Credit',
        tra_ref: data.id,
        tra_item_ref: -1,
        tra_type: 'CREDIT',
        credit: credit,
        debit: debit,
        balance: balance,
        status: 'issued'
      })
      .then(data2=>{
        callBack({error:false, data:result, errorMessage:''});
      })
      .catch(err2=>{
        callBack({error:true, data:null, errorMessage:''});
      });
    })
    .catch(err1=>{
      callBack({error:true, data:null, errorMessage:''});
    });    
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
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