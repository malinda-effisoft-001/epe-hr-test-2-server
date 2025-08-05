const db = require('../../models/sequelize');
const employeeType = db.employeeType;
const Op = db.Sequelize.Op;
const fs = require('fs');

exports.search = async (req, rpp, page, callBack) => {
  let where;
  if(req.description!==undefined){
    where = {
      [Op.or]: [
      {
        description: {
          [Op.like]: '%'+req.description+'%'
        }
      }
    ]};
  }
  else{
    where = {};
  }
  if(req.id!==undefined){
    where.id = req.id;
  }
  if(req.food!==undefined){
    where.food = req.food;
  }
  if(req.status!==undefined){
    where.status = req.status;
  }
  if(rpp===0){
    employeeType.findAndCountAll({
        attributes: ['id', 'code', 'color', 'description', 'food', 'status'],
        order: [[req.sortBy, req.order]],
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
      callBack({error:true, data:null, errorMessage:err});
    });
  }
  else{
    try{
      const { count, rows } = await employeeType.findAndCountAll({
        attributes: ['id', 'code', 'color', 'description', 'food', 'status'],
        order: [[req.sortBy, req.order]],
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

exports.findOne = (req, callBack) => {
  employeeType.findOne({
    attributes: ['id', 'code', 'description', 'color', 'food', 'status'],
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

exports.findActive = (req, callBack) => {
    let where = {};
    where.status = "active";
    employeeType.findAndCountAll({
        attributes: ['id', 'code', 'description', 'color', 'status'],
        where: where
    })
    .then(data=>{
        callBack({error:false, data:data, errorMessage:""});
    })
    .catch(err=>{
        callBack({error:true, data:null, errorMessage:err});
    });
};

exports.create = async (req, callBack) => {
    employeeType.findOne({
      attributes: ['id', 'code', 'description'],
        where: {
          [Op.or]: [
            {
              code: {
                [Op.eq]: req.body.code
              }
            },
            {
              description: {
                [Op.eq]: req.body.description
              }
            },
          ]
        }
      })
      .then(data=>{
        if(!data){
            employeeType.create({
                code: req.body.code,
                description: req.body.description,
                color: req.body.color,
                food: req.body.food,
                status: req.body.status
          })
          .then(data1=>{
            callBack({error:false, status: 'ok', data:data1, errorMessage:""});
          })
          .catch(err1=>{
            callBack({error:true, status: '', data:null, errorMessage:err1});
          });
        }
        else{
          if(req.body.code===data.code){
            callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
          }
          else if(req.body.description===data.description){
            callBack({error:false, status: "duplicate_description", data:null, errorMessage:""});
          }
          else{
            callBack({error:false, status: "duplicate_other", data:null, errorMessage:""});
          }
        }
    })
    .catch(err=>{
      callBack({error:true, status: "", data:null, errorMessage:err});
    });
};

exports.edit = (req, callBack) => {
    employeeType.findOne({
    attributes: ['id', 'code', 'description'],
    where: {
      [Op.or]: [
        {
          code: {
            [Op.and]: {
              [Op.eq]: req.body.code,
              [Op.ne]: '',
            }
          }
        },
        {
          description: {
            [Op.and]: {
              [Op.eq]: req.body.description,
              [Op.ne]: '',
            }
          }
        },
      ],
      id: {
        [Op.ne]: req.body.id
      }
    }
  })
  .then(data=>{
    if(!data){
        employeeType.update(
        {
            description: req.body.description,
            code: req.body.code,
            color: req.body.color,
            food: req.body.food,
            status: req.body.status
        }, 
        {
          where: {
            id: req.body.id
          }
        }
      )
      .then(data1=>{
        callBack({error:false, status: 'ok', data:data1, errorMessage:""});
      })
      .catch(err1=>{
        callBack({error:true, status: '', data:null, errorMessage:err1});
      });
    }
    else{
      if(req.body.code===data.code){
        callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
      }
      else if(req.body.description===data.description){
        callBack({error:false, status: "duplicate_description", data:null, errorMessage:""});
      }
      else{
        callBack({error:false, status: "duplicate_other", data:null, errorMessage:""});
      }
    }
  })
  .catch(err=>{
    callBack({error:true, status: "", data:null, errorMessage:err});
  });
};

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};