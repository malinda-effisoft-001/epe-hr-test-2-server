const db = require('../../models/sequelize');
const employee = db.employee;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const fs = require('fs');

exports.search = async (req, rpp, page, callBack) => {
  let where;
  if(req.description!==undefined){
    where = {
      [Op.or]: [
        {
          code: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          barcode: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          first_name: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          epf_no: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          last_name: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          email: {
            [Op.like]: '%'+req.description+'%'
          }
        },
        {
          phone: {
            [Op.like]: '%'+req.description+'%'
          }
        }
      ]
    };
  }
  else{
    where = {};
  }
  if(req.id!==undefined){
    where.id = req.id;
  }
  if(req.typeId!==undefined){
    where.employee_type_id = req.typeId;
  }
  if(req.payType!==undefined){
    where.pay_type = req.payType;
  }
  if(req.estateId!==undefined){
    where.estate_id = req.estateId;
  }
  if(req.divisionId!==undefined){
    where.division_id = req.divisionId;
  }
  if(req.status!==undefined){
    where.status = req.status;
  }
  if(req.user_type===5){
    where.estate_id = {
      [Op.in]: req.estates
    };
  }
  if(req.user_type===7){
    where.division_id = {
      [Op.in]: req.divisions
    };
  }
  if(rpp===0){
    employee.findAndCountAll({
      attributes: ['id', 'employee_type_id', 'estate_id', 'division_id', 'epf_no', 'first_name', 'last_name', 'email', 'image_url', 'status'],
      include: [
        {
          model: db.employeeType,
          attributes: ['id', 'description']
        },
        {
          model: db.estate,
          attributes: ['id', 'code', 'description', 'color']
        },
        {
          model: db.division,
          attributes: ['id', 'code', 'description', 'color']
        }
      ],
      where: where
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
      var start = rpp * (page-1);
      var data1 ={
        data: data.rows,
        row_count: rowCount,
        nop: numOfPages,
        start: start
      };
      callBack({error:false, data:data1, errorMessage:""});
    })
    .catch(err=>{
      callBack({error:true, data:null, errorMessage:''});
    });
  }
  else{
    try{
      const { count, rows } = await employee.findAndCountAll({
        attributes: ['id', 'employee_type_id', 'estate_id', 'division_id', 'epf_no', 'first_name', 'last_name', 'email', 'image_url', 'status'],
        include: [
          {
            model: db.employeeType,
            attributes: ['id', 'description']
          },
          {
            model: db.estate,
            attributes: ['id', 'code', 'description', 'color']
          },
          {
            model: db.division,
            attributes: ['id', 'code', 'description', 'color']
          }
        ],
        where: where,
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

exports.findForEstate = (req, callBack) => {
    let where = {};
    where.status = "active";
    where.estate_id = req.estateId;
    employee.findAndCountAll({
      attributes: ['id', 'employee_type_id', 'estate_id', 'first_name', 'last_name', 'email', 'image_url', 'status'],
      include: [
        {
          model: db.employeeType,
          attributes: ['id', 'description']
        },
        {
          model: db.estate,
          attributes: ['id', 'code', 'description']
        }
      ],
      where: where
    })
    .then(data=>{
        callBack({error:false, data:data, errorMessage:""});
    })
    .catch(err=>{
        callBack({error:true, data:null, errorMessage:''});
    });
};

exports.findForText = (req, callBack) => {
  var args = req.search_data;
  let where;
  if(args.description!==undefined){
    where = {
      [Op.or]: [
        {
          code: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          barcode: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          first_name: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          epf_no: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          last_name: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          email: {
            [Op.like]: '%'+args.description+'%'
          }
        },
        {
          phone: {
            [Op.like]: '%'+args.description+'%'
          }
        }
      ]
    };
  }
  else{
    where = {};
  }
  where.status = "active";
  if(args.user_type===5 || args.user_type===6 || args.user_type===7 || args.user_type===8 || args.user_type===9 || args.user_type===10){
    if(args.estates!==undefined){
      where.estate_id = {
        [Op.in]: args.estates
      };
    }
    if(args.divisions!==undefined){
      where.division_id = {
        [Op.in]: args.divisions
      };
    }
  }
  employee.findAndCountAll({
    attributes: ['id', 'employee_type_id', 'epf_no', 'first_name', 'last_name', 'email', 'image_url', 'status'],
    include: [
      {
        model: db.employeeType,
        attributes: ['id', 'description']
      }
    ],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.findActive = (req, callBack) => {
  let where = {};
  where.status = "active";
  var args = req.search_data;
  if(args.user_type===5 || args.user_type===6){
    where.estate_id = {
      [Op.in]: args.estates
    };
  }
  if(args.user_type===7 || args.user_type===8){
    where.division_id = {
      [Op.in]: args.divisions
    };
  }
  employee.findAndCountAll({
    attributes: ['id', 'employee_type_id', 'code', 'barcode', 'epf_no', 'first_name', 'last_name', 'allow_credit', 'vegetarian', 'food_pay_type', 'email', 'image_url'],
    include: [
      {
        model: db.employeeType,
        attributes: ['id', 'description']
      },
      {
        model: db.estate,
        attributes: ['id', 'description']
      },
      {
        model: db.division,
        attributes: ['id', 'description']
      }
    ],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.create = async (req, callBack) => {
  employee.findOne({
    attributes: ['id', 'code', 'barcode', 'epf_no', 'email', 'phone'],
    where: {
      [Op.or]: [
        {
          code: {
            [Op.and]: {
              [Op.eq]: req.code,
              [Op.ne]: '',
            }
          }
        },
        {
          barcode: {
            [Op.and]: {
              [Op.eq]: req.barcode,
              [Op.ne]: '',
            }
          }
        },
        {
          epf_no: {
            [Op.and]: {
              [Op.eq]: req.epfNo,
              [Op.ne]: '',
            }
          }
        },
        {
          email: {
            [Op.and]: {
              [Op.eq]: req.email,
              [Op.ne]: '',
            }
          }
        },
        {
          phone: {
            [Op.and]: {
              [Op.eq]: req.phone,
              [Op.ne]: '',
            }
          }
        }
      ]
    }
  })
  .then(data=>{
    if(!data){
      employee.create({
        employee_type_id: req.typeId,
        pay_type: req.payType,
        estate_id: req.estateId,
        division_id: req.divisionId,
        allow_credit: req.allowCredit,
        zone_code: req.zoneCode,
        code: req.code,
        barcode: req.barcode,
        epf_no: req.epfNo,
        initials: req.initials,
        first_name: req.firstName,
        last_name: req.lastName,
        phone: req.phone,
        email: req.email,
        address: req.address,
        gender: req.gender,
        dob: req.dob,
        nic: req.nic,
        start_date: req.startDate,
        end_date: req.endDate,
        vegetarian: req.vegetarian,
        food_pay_type: req.foodPayType,
        image_url: 'none',
        status: req.status
      })
      .then(async data1=>{
        var val = {
          id: data1.id
        }
        callBack({error:false, status: "ok", data:val, errorMessage:""});
      })
      .catch(err1=>{
        callBack({error:true, status: "", data:null, errorMessage:''});
      });
    }
    else{
      if(req.code===data.code){
        callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
      }
      else if(req.barcode===data.barcode){
        callBack({error:false, status: "duplicate_barcode", data:null, errorMessage:""});
      }
      else if(req.epf_no===data.epf_no){
        callBack({error:false, status: "duplicate_epf_no", data:null, errorMessage:""});
      }
      else if(req.email===data.email){
        callBack({error:false, status: "duplicate_email", data:null, errorMessage:""});
      }
      else if(req.phone===data.phone){
        callBack({error:false, status: "duplicate_phone", data:null, errorMessage:""});
      }
      else{
        callBack({error:false, status: "duplicate_other", data:null, errorMessage:""});
      }
    }
  })
  .catch(err=>{
    callBack({error:true, status: "", data:null, errorMessage:''});
  });
};

exports.edit = (req, callBack) => {
  employee.findOne({
    attributes: ['id', 'code', 'barcode', 'epf_no', 'phone', 'email'],
    where: {
      [Op.or]: [
        {
          code: {
            [Op.and]: {
              [Op.eq]: req.code,
              [Op.ne]: '',
            }
          }
        },
        {
          barcode: {
            [Op.and]: {
              [Op.eq]: req.barcode,
              [Op.ne]: '',
            }
          }
        },
        {
          epf_no: {
            [Op.and]: {
              [Op.eq]: req.epfNo,
              [Op.ne]: '',
            }
          }
        },
        {
          email: {
            [Op.and]: {
              [Op.eq]: req.email,
              [Op.ne]: '',
            }
          }
        },
        {
          phone: {
            [Op.and]: {
              [Op.eq]: req.phone,
              [Op.ne]: '',
            }
          }
        }
      ],
      id: {
        [Op.ne]: req.id
      }
    }
  })
  .then(data=>{
    if(!data){
      employee.update(
        {
          employee_type_id: req.typeId,
          pay_type: req.payType,
          estate_id: req.estateId,
          division_id: req.divisionId,
          allow_credit: req.allowCredit,
          zone_code: req.zoneCode,
          code: req.code,
          barcode: req.barcode,
          epf_no: req.epfNo,
          initials: req.initials,
          first_name: req.firstName,
          last_name: req.lastName,
          phone: req.phone,
          email: req.email,
          address: req.address,
          gender: req.gender,
          dob: req.dob,
          nic: req.nic,
          start_date: req.startDate,
          end_date: req.endDate,
          vegetarian: req.vegetarian,
          food_pay_type: req.foodPayType,
          status: req.status,
        }, 
        {
          where: {
            id: req.id
          }
        }
      )
      .then(data1=>{
        callBack({error:false, status: "ok", data:data1, errorMessage:""});
      })
      .catch(err1=>{
        callBack({error:true, status: "", data:null, errorMessage:''});
      });
    }
    else{
      if(req.code===data.code){
        callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
      }
      else if(req.barcode===data.barcode){
        callBack({error:false, status: "duplicate_barcode", data:null, errorMessage:""});
      }
      else if(req.epf_no===data.epf_no){
        callBack({error:false, status: "duplicate_epf_no", data:null, errorMessage:""});
      }
      else if(req.email===data.email){
        callBack({error:false, status: "duplicate_email", data:null, errorMessage:""});
      }
      else if(req.phone===data.phone){
        callBack({error:false, status: "duplicate_phone", data:null, errorMessage:""});
      }
      else{
        callBack({error:false, status: "duplicate_other", data:null, errorMessage:""});
      }
    }
  })
  .catch(err=>{
      callBack({error:true, status: "", data:null, errorMessage:''});
  });
};

exports.find = (req, callBack) => {
  employee.findOne({
    attributes: ['id', 'employee_type_id', 'pay_type', 'estate_id', 'division_id', 'allow_credit', 'zone_code', 'code', 'barcode', 'epf_no', 'gender', 'initials', 'first_name', 'last_name', 'phone', 'email', 'address', 'dob', 'nic', 'start_date', 'end_date', 'vegetarian', 'food_pay_type', 'image_url', 'status'],
    include: [
      {
        model: db.employeeType,
        attributes: ['id', 'description']
      },
      {
        model: db.estate,
        attributes: ['id', 'code', 'description']
      },
      {
        model: db.division,
        attributes: ['id', 'code', 'description']
      }
    ],
    where: {
      id: req.id
    }
  })
  .then(data=>{
    if(!data){
      callBack({error:true, data:null, errorMessage:""});
    }
    else{
      callBack({error:false, data:data, errorMessage:""});
    }
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.editImage = (req, callBack) => {
    employee.findOne({
      attributes: ['image_url'],
      where: {
        id: req.body.id
      }
    })
    .then(data=>{
      var error1 = false;
      if(data.image_url!=="none"){
        fs.unlink(appRoot + "/" + data.image_url, (err1) => {
          if(err1){
            error1 = true;
            callBack({error:true, data:null, errorMessage:""});
          }
        });
      }
      if(!error1){
        var path = (req.file.path).replace(appRoot + "/", "");
        path = (path).replace(appRoot + '\\', "");
        path = (path).replaceAll('\\', "/");
        employee.update(
          {
            image_url: path
          }, 
          {
            where: {
              id: req.body.id
            }
          }
        )
        .then(data1=>{
          callBack({error:false, data:path, errorMessage:""});
        })
        .catch(err1=>{
          callBack({error:true, data:null, errorMessage:""});
        });
      }
    })
    .catch(err=>{
      callBack({error:true, data:null, errorMessage:""});
    });
};

exports.deleteImage = (req, callBack) => {
    employee.findOne({
        attributes: ['image_url'],
        where: {
          id: req.id
        }
    })
    .then(data=>{
        if(data.image_url!=="none"){
            fs.unlink(appRoot + "/" + data.image_url, (err) => {
              if(err){
                callBack({error:true, data:null, errorMessage:''});
              }
              else{
                  employee.update(
                    {
                        image_url: "none"
                    }, 
                    {
                      where: {
                        id: req.id
                      }
                    }
                )
                .then(data1=>{
                    callBack({error:false, data:data1, errorMessage:""});
                })
                .catch(err1=>{
                    callBack({error:true, data:null, errorMessage:err1});
                });
              }
            });
        }
        else{
            callBack({error:false, data:null, errorMessage:""});
        }
    })
    .catch(err=>{
        callBack({error:true, data:null, errorMessage:""});
    });
};

exports.getBalance = (req, callBack) => {
  db.shopAccount.findAll({
    attributes: ['id', 'balance'],
    limit: 1,
    where: {
      employee_id: req.employee_id
    },
    order: [ [ 'id', 'DESC' ]]
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:''});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};