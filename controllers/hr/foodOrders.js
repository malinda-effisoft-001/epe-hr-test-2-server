const db = require('../../models/sequelize');
const foodOrder = db.foodOrder;
const Op = db.Sequelize.Op;

exports.search = async (req, rpp, page, callBack) => {
  let order = [[req.sort_by, req.order]];
  let where = {};
  if(req.from!==undefined && req.to!==undefined){
    where = {
      u_date: {
        [Op.between]: [req.from, req.to]
      }
    };
  }
  else if(req.from!==undefined){
    where = {
      u_date: {
        [Op.gte]: req.from
      }
    };
  }
  else if(req.to!==undefined){
    where = {
      u_date: {
        [Op.lte]: req.to
      }
    };
  }
  if(req.id!==undefined){
    where.id = req.id;
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
  if(req.employee_id!==undefined){
    where.employee_id = req.employee_id;
  }
  if(req.menu_id!==undefined){
    where.menu_id = req.menu_id;
  }
  if(req.pay_status!==undefined){
    where.pay_status = req.pay_status;
  }
  if(req.food_pay_type!==undefined){
    where.food_pay_type = req.food_pay_type;
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
  if(req.user_type===7){
    where.user_id = req.request_user_id;
  }
  if(rpp===0){
    foodOrder.findAndCountAll({
      attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'menu_id', 'pay_status', 'status'],
      include: [
        {
          model: db.user,
          attributes: ['id', 'first_name', 'last_name']
        },
        {
          model: db.estate,
          attributes: ['id', 'description']
        },
        {
          model: db.division,
          attributes: ['id', 'description']
        },
        {
          model: db.employee,
          attributes: ['id', 'first_name', 'last_name', 'epf_no', 'image_url']
        },
        {
          model: db.menu,
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
      callBack({error:true, data:null, errorMessage:err});
    });
  }
  else{
    try{
      const { count, rows } = await foodOrder.findAndCountAll({
        attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'menu_id', 'pay_status', 'status'],
        include: [
          {
            model: db.user,
            attributes: ['id', 'first_name', 'last_name']
          },
          {
            model: db.estate,
            attributes: ['id', 'description']
          },
          {
            model: db.division,
            attributes: ['id', 'description']
          },
          {
            model: db.employee,
            attributes: ['id', 'first_name', 'last_name', 'epf_no', 'image_url']
          },
          {
            model: db.menu,
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
  foodOrder.findOne({
    attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'employee_id', 'menu_id', 'food_pay_type', 'menu_weight', 'weight', 'pay_status', 'status'],
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
        model: db.employee,
        include: [
          {
            model: db.employeeWeight,
            attributes: ['id', 'balance']
          },
        ],
        attributes: ['id', 'epf_no', 'first_name', 'last_name', 'vegetarian', 'image_url']
      },
      {
        model: db.menu,
        attributes: ['id', 'description', 'color']
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
    callBack({error:true, data:null, errorMessage:err});
  });
};

exports.findForEmployee = (req, callBack) => {
  var u_date = getDate();
  foodOrder.findOne({
    attributes: ['id', 'u_date', 'u_time', 'user_id', 'estate_id', 'division_id', 'menu_id', 'food_pay_type', 'menu_weight', 'weight', 'pay_status', 'status'],
    include: [
      {
        model: db.user,
        attributes: ['id', 'first_name', 'last_name']
      },
      {
        model: db.estate,
        attributes: ['id', 'description']
      },
      {
        model: db.division,
        attributes: ['id', 'description']
      },
      {
        model: db.menu,
        attributes: ['id', 'description']
      },
      {
        model: db.employee,
        include: [
          {
            model: db.employeeWeight,
            attributes: ['id', 'balance']
          },
        ],
        attributes: ['id', 'first_name', 'last_name']
      },
    ],
    where: {
      employee_id: req.employee_id,
      u_date: u_date,
    }
  })
  .then(data=>{
    if(data){
      callBack({error:false, status:'exists', data:data, errorMessage:""});
    }
    else{
      db.employeeWeight.findOne({
        attributes: ['id', 'balance'],
        where: {
          employee_id: req.employee_id
        }
      })
      .then(data1=>{
        if(data1){
          callBack({error:false, status:'not_found', data:{balance: data1.balance}, errorMessage:""});
        }
        else{
          callBack({error:false, status:'not_found', data:{balance: 0.0}, errorMessage:""});
        }
      })
      .catch(err=>{
        callBack({error:true, status: "", data:null, errorMessage:err});
      });      
    }    
  })
  .catch(err=>{
    callBack({error:false, status:'error', data:[], errorMessage:''});
  });
};

exports.create = async (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  foodOrder.findOne({
    attributes: ['id', 'u_date', 'employee_id'],
    where: {
      [Op.and]: [
        {
          employee_id: {
            [Op.eq]: req.body.employee_id
          }
        },
        {
          u_date: {
            [Op.eq]: u_date
          }
        },
      ]
    }
  })
  .then(data=>{
    if(!data){
      foodOrder.create({
        u_date: u_date,
        u_time: u_time,
        user_id: req.body.user_id,
        estate_id: req.body.estate_id,
        division_id: req.body.division_id,
        employee_id: req.body.employee_id,
        menu_id: req.body.menu_id,
        food_pay_type: req.body.food_pay_type,
        menu_weight: req.body.menu_weight,
        weight: req.body.weight,
        pay_status: 'pending',
        status: 'selected'
      })
      .then(data1=>{        
        callBack({error:false, status: 'ok', data:{id: data1.id, u_date: u_date, u_time: u_time, status: 'pending'}, errorMessage:""});
      })
      .catch(err1=>{
        callBack({error:true, status: '', data:null, errorMessage:err1});
      });
    }
    else{
      callBack({error:false, status: "duplicate_entry", data:null, errorMessage:""});
    }
  })
  .catch(err=>{
    callBack({error:true, status: "", data:null, errorMessage:err});
  });
};

exports.edit = async (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  foodOrder.update(
    {
      u_date: u_date,
      u_time: u_time,
      user_id: req.body.user_id,
      estate_id: req.body.estate_id,
      division_id: req.body.division_id,
      employee_id: req.body.employee_id,
      food_pay_type: req.body.food_pay_type,
      menu_weight: req.body.menu_weight,
      weight: req.body.weight,
      menu_id: req.body.menu_id
    }, 
    {
      where: {
        id: req.body.id
      }
    }
  )
  .then(data1=>{
    callBack({error:false, status: 'ok', data:{id: req.body.id, u_date: u_date, u_time: u_time}, errorMessage:""});
  })
  .catch(err1=>{
    callBack({error:true, status: '', data:null, errorMessage:err1});
  });
};

exports.cancel = async (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  foodOrder.update(
    {
      status: 'cancelled'
    }, 
    {
      where: {
        id: req.body.id
      }
    }
  )
  .then(data1=>{
    callBack({error:false, status: 'ok', data:{id: req.body.id, u_date: u_date, u_time: u_time, status: 'cancelled'}, errorMessage:""});
  })
  .catch(err1=>{
    callBack({error:true, status: '', data:null, errorMessage:err1});
  });
};

exports.issue = async (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  var employee_id = req.body.employee_id;
  var food_pay_type = req.body.food_pay_type;
  var weight = req.body.weight;
  foodOrder.update(
    {
      food_pay_type: food_pay_type,
      weight: weight,
      status: 'issued'
    }, 
    {
      where: {
        id: req.body.id
      }
    }
  )
  .then(data=>{
    var menu_weight = req.body.menu_weight;
    var balance = req.body.balance;
    var remaining_weight = (balance + weight) - menu_weight;
    db.employeeWeight.findOne({
      attributes: ['id', 'employee_id'],
      where: {
        id: employee_id
      }
    })
    .then(data=>{
      if(!data){
        db.employeeWeight.create({
          employee_id: employee_id,
          balance: remaining_weight
        })
        .then(data1=>{        
          callBack({error:false, status: 'ok', data:{id: req.body.id, u_date: u_date, u_time: u_time, status: 'issued'}, errorMessage:""});
        })
        .catch(err1=>{
          callBack({error:true, status: '', data:null, errorMessage:''});
        });
      }
      else{
        db.employeeWeight.update(
          {
            balance: remaining_weight
          }, 
          {
            where: {
              employee_id: employee_id,
            }
          }
        )
        .then(data1=>{
          callBack({error:false, status: 'ok', data:{id: req.body.id, u_date: u_date, u_time: u_time, status: 'issued'}, errorMessage:""});
        })
        .catch(err1=>{
          callBack({error:true, status: '', data:null, errorMessage:''});
        });
      }
    })
    .catch(err=>{
      callBack({error:true, status: "", data:null, errorMessage:''});
    });
  })
  .catch(err=>{
    callBack({error:true, status: '', data:null, errorMessage:''});
  });
};

exports.getReport = (req, callBack) => {
  let where = {
    u_date: {
      [Op.between]: [req.from, req.to]
    }
  };
  if(req.estate_id!==undefined){
    where.estate_id = req.estate_id;
  }
  if(req.division_id!==undefined){
    where.division_id = req.division_id;
  }
  where.status = {[Op.or]: ['selected', 'issued']};
  if(req.user_type===5 || req.user_type===6 || req.user_type===7 || req.user_type===8 || req.user_type===9 || req.user_type===10){
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
  foodOrder.findAndCountAll({
    attributes: ['id', 'u_date', 'estate_id', 'division_id', 'employee_id', 'menu_id', 'food_pay_type', 'weight', 'pay_status'],
    include: [
      {
        model: db.estate,
        attributes: ['id', 'description']
      },
      {
        model: db.division,
        attributes: ['id', 'description']
      },
      {
        model: db.employee,
        attributes: ['id', 'epf_no', 'first_name', 'last_name']
      },
      {
        model: db.menu,
        attributes: ['id', 'description']
      },
    ],
    where: where,
    order: ['estate_id', 'division_id', 'menu_id']
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:false, data:[], errorMessage:""});
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