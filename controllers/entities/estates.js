const db = require('../../models/sequelize');
const estate = db.estate;
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
        },
        {
          code: {
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
    if(req.user_type===5 || req.user_type===6){
      where.id = {
        [Op.in]: req.estates
      };
    }
    if(rpp===0){
        estate.findAndCountAll({
            attributes: ['id', 'code', 'description', 'color', 'image_url', 'lat', 'lng', 'status'],
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
            const { count, rows } = await estate.findAndCountAll({
                attributes: ['id', 'code', 'description', 'color', 'image_url', 'lat', 'lng', 'status'],
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
    estate.findOne({
        attributes: ['id', 'code', 'description', 'color', 'image_url', 'lat', 'lng', 'status'],
        include: [{
          model: db.estateUser,
          include: [
            {
              model: db.userType,
              attributes: ['id', 'description']
            },
            {
              model: db.user,
              attributes: ['id', 'first_name', 'last_name', 'email', 'image_url', 'status']
            }
          ],
          attributes: ['id', 'user_id', 'status']
        }],
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
  var args = req.search_data;
  if(args.user_type===5 || args.user_type===6 || args.user_type===7 || args.user_type===8 || args.user_type===9 || args.user_type===10){
    if(args.estates!==undefined){
      where.id = {
        [Op.in]: args.estates
      };
    }
  }
  estate.findAndCountAll({
    attributes: ['id', 'code', 'description', 'color', 'image_url', 'lat', 'lng', 'status'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:err});
  });
};

exports.findForAttendance = (req, callBack) => {
  let where = {};
  where.status = "active";
  var args = req.search_data;
  if(args.user_type===5 || args.user_type===6 || args.user_type===7 || args.user_type===8 || args.user_type===9 || args.user_type===10){
    if(args.estates!==undefined){
      where.id = {
        [Op.in]: args.estates
      };
    }
  }
  estate.findAndCountAll({
    attributes: ['id', 'description'],
    include: [
      {
        model: db.division,
        attributes: ['id', 'description']
      },
    ],
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
  estate.findOne({
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
          estate.create({
              code: req.body.code,
              description: req.body.description,
              color: req.body.color,
              image_url: 'none',
              lat: req.body.lat,
              lng: req.body.lng,
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
  estate.findOne({
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
      estate.update(
        {
          code: req.body.code,
          description: req.body.description,
          color: req.body.color,
          lat: req.body.lat,
          lng: req.body.lng,
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

exports.deleteImage = (req, callBack) => {
    estate.findOne({
        attributes: ['image_url'],
        where: {
          id: req.body.id
        }
    })
    .then(data=>{
        if(data.image_url!=="none"){
            fs.unlink(appRoot + "/" + data.image_url, (err) => {
              if(err){
                callBack({error:true, data:null, errorMessage:""});
              }
              else{
                  estate.update(
                    {
                        image_url: "none"
                    }, 
                    {
                      where: {
                        id: req.body.id
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
        callBack({error:true, data:null, errorMessage:err});
    });
};

exports.editImage = (req, callBack) => {
    estate.findOne({
        attributes: ['image_url'],
        where: {
          id: req.body.id
        }
    })
    .then(data=>{
        var error1 = false;
        if(data.image_url!=="none"){
            fs.unlink(appRoot + "/" + data.image_url, (err) => {
              if(err){
                error1 = true;
                callBack({error:true, data:null, errorMessage:err});
              }
            });
        }
        if(!error1){
            var path = (req.file.path).replace(appRoot + "/", "");
            path = (path).replace(appRoot + '\\', "");
            path = (path).replaceAll('\\', "/");
            estate.update(
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

exports.removeUser = (req, callBack) => {
    db.estateUser.destroy({
        where: {
            estate_id: req.estateId,
            user_id: req.userId,
        }
    })
    .then(data=>{
        callBack({error:false, data:data, errorMessage:""});
    })
    .catch(err => {
        callBack({error:true, data:null, errorMessage:"!"});
    });
};

exports.addUser = (req, callBack) => {
  db.estateUser.create({
    estate_id: req.estateId,
    user_type_id: req.userTypeId,
    user_id: req.userId,
    status: 'active',
  })
  .then(data1=>{
    callBack({error:false, data:data1, errorMessage:""});
  })
  .catch(err1=>{
    callBack({error:true, data:null, errorMessage:""});
  });
};

exports.changeUserStatus = (req, callBack) => {
  db.estateUser.update(
    {
      status: req.status
    }, 
    {
      where: {
        estate_id: req.estateId,
        user_id: req.userId,
      }
    }
  )
  .then(data1=>{
    callBack({error:false, data:data1, errorMessage:""});
  })
  .catch(err1=>{
    callBack({error:true, data:null, errorMessage:err1});
  });
};

exports.delete = (req, res) => {
  
};

exports.deleteAll = (req, res) => {
  
};