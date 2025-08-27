const db = require('../../models/sequelize');
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

exports.getBalances = (req, callBack) => {
  let where = {};
  where.estate_id = req.estate_id;
  where.division_id = req.division_id;
  db.shopAccount.findAndCountAll({
    attributes: [[Sequelize.fn('MAX', Sequelize.col('id')), 'id'], 'estate_id', 'division_id', 'employee_id', 'balance'],
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
        attributes: ['id', 'epf_no', 'first_name', 'last_name', 'image_url'],
        include: [
          {
            model: db.foodOrder,
            attributes: [],
            where: {}
          }
        ]
      },
    ],
    group: ['employee_id'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:false, data:[], errorMessage:""});
  });
};


/* where = {
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
}; */



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