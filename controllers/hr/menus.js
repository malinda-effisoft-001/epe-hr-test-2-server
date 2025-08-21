const db = require('../../models/sequelize');
const menu = db.menu;
const Op = db.Sequelize.Op;

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
    if(req.status!==undefined){
      where.status = req.status;
    }
    if(rpp===0){
        menu.findAndCountAll({
            attributes: ['id', 'code', 'color', 'description', 'status'],
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
            callBack({error:true, data:null, errorMessage:''});
        });
    }
    else{
        try{
            const { count, rows } = await menu.findAndCountAll({
                attributes: ['id', 'code', 'color', 'description', 'status'],
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
    menu.findOne({
        attributes: ['id', 'code', 'description', 'color', 'weight', 'status'],
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

exports.findActive = (req, callBack) => {
  let where = {};
  where.status = "active";
  menu.findAndCountAll({
    attributes: ['id', 'code', 'description', 'color', 'weight', 'status'],
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
  menu.findOne({
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
        menu.create({
          code: req.body.code,
          description: req.body.description,
          weight: req.body.weight,
          color: req.body.color,
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
    callBack({error:true, status: "", data:null, errorMessage:''});
  });
};

exports.edit = (req, callBack) => {
  menu.findOne({
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
        }
      ],
      id: {
        [Op.ne]: req.body.id
      }
    }
  })
  .then(data=>{
    if(!data){
      menu.update(
        {
          description: req.body.description,
          code: req.body.code,
          weight: req.body.weight,
          color: req.body.color,
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
    callBack({error:true, status: "", data:null, errorMessage:''});
  });
};

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};