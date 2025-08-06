const db = require('../../models/sequelize');
const user = db.user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcryptjs");
const fs = require('fs');

exports.activeTypes = (req, callBack) => {
  let where = {};
  where.status = "active";
  db.userType.findAndCountAll({
    attributes: ['id', 'description'],
    where: where
  })
  .then(data=>{
    callBack({error:false, data:data, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:err});
  });
};

exports.getForHr = (req, callBack) => {
  let where = {};
  let userOk = false;
  if(req.user_type===1 || req.user_type===2 || req.user_type===3){
    where = {
      [Op.or]: [
        {
          user_type_id: 1
        },
        {
          user_type_id: 2
        },
        {
          user_type_id: 3
        },
        {
          user_type_id: 5
        },
        {
          user_type_id: 7
        },
        {
          user_type_id: 9
        },
        {
          user_type_id: 10
        },
    ]};
    userOk = true;
  }
  else if(req.user_type===5){
    where = {
      [Op.or]: [
        {
          user_type_id: 7
        },
        {
          user_type_id: 9
        },
        {
          user_type_id: 10
        },
    ]};
    userOk = true;
  }
  else if(req.user_type===9){
    where = {user_type_id: 9};
    userOk = true;
  }
  where.status = "active";
  if(userOk){
    user.findAndCountAll({
      attributes: ['id', 'user_type_id', 'first_name', 'last_name', 'email', 'image_url'],
      include: [
        {
          model: db.userType,
          attributes: ['id', 'description']
        }
      ],
      where: where
    })
    .then(data=>{
      callBack({error:false, data:data, errorMessage:""});
    })
    .catch(err=>{
      callBack({error:true, data:null, errorMessage:err});
    });
  }
  else{
    callBack({error:false, data:[], errorMessage:""});
  }
};

exports.getForEstates = (req, callBack) => {
  let where = {};
  if(req.user_type_id===1 || req.user_type_id===2){
    where = {
      [Op.or]: [
        {
          user_type_id: 5
        },
        {
          user_type_id: 6
        }
    ]};
  }
  else if(req.user_type_id===3){
    where = {user_type_id: 5};
  }
  else if(req.user_type_id===4){
    where = {user_type_id: 6};
  }
  where.status = "active";
  user.findAndCountAll({
    attributes: ['id', 'user_type_id', 'first_name', 'last_name', 'email', 'image_url'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      }
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

exports.getForDivisions = (req, callBack) => {
  let where = {
    [Op.or]: [
      {
        user_type_id: 7
      },
      {
        user_type_id: 8
      },
      {
        user_type_id: 9
      }
  ]};
  where.status = "active";
  user.findAndCountAll({
    attributes: ['id', 'user_type_id', 'first_name', 'last_name', 'email', 'image_url'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      }
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

exports.getForShops = (req, callBack) => {
  let where = {user_type_id: 10};
  where.status = "active";
  user.findAndCountAll({
    attributes: ['id', 'user_type_id', 'first_name', 'last_name', 'email', 'image_url'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      }
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
        ]};
    }
    else{
        where = {};
    }
    if(req.id!==undefined){
      where.id = req.id;
    }
    if(req.typeId!==undefined){
      where.user_type_id = req.typeId;
    }
    if(req.status!==undefined){
      where.status = req.status;
    }
    if(rpp===0){
        user.findAndCountAll({
            attributes: ['id', 'code', "user_type_id", 'first_name', 'last_name', 'email', 'image_url', 'status'],
            include: [
              {
                model: db.userType,
                attributes: ['id', 'description']
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
            callBack({error:true, data:null, errorMessage:err});
        });
    }
    else{
        try{
            const { count, rows } = await user.findAndCountAll({
                attributes: ['id', 'code', "user_type_id", 'first_name', 'last_name', 'email', 'image_url', 'status'],
                include: [
                  {
                    model: db.userType,
                    attributes: ['id', 'description']
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

exports.signinAdmin = (req, callBack) => {
  let where = {};
  where.user_type_id = 1;
  where.email = req.email;
  user.findOne({ 
    attributes: ['id', 'first_name', 'last_name', 'email', 'image_url', 'status', 'password'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      }
    ],
    where: where
  })
  .then(data => {
    if(!data){
      callBack({error:true, data:null, errorMessage:""});
    } 
    else{
      var compareRes = bcrypt.compareSync(req.password, data.password);
      if(compareRes){
        const val = {
          id: data.id,
          typeId: data.user_type.id,
          typeDescription: data.user_type.description,
          name: data.first_name+" "+data.last_name,
          email: data.email,
          imageUrl: data.image_url,
          status: data.status,
          shops: data.shops_users,
        };
        callBack({error:false, data:val, errorMessage:""});
      }
      else{
        callBack({error:true, data:null, errorMessage:""});
      }
    };
  })
  .catch(err => {
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.signin = (req, callBack) => {
  var output = [];
  let where = {
    [Op.or]: [
      {
        user_type_id: {
          [Op.eq]: 1
        }
      },
      {
        user_type_id: {
          [Op.eq]: 2
        }
      },
      {
        user_type_id: {
          [Op.eq]: 3
        }
      },
      {
        user_type_id: {
          [Op.eq]: 4
        }
      },
      {
        user_type_id: {
          [Op.eq]: 5
        }
      },
      {
        user_type_id: {
          [Op.eq]: 6
        }
      },
      {
        user_type_id: {
          [Op.eq]: 7
        }
      },
      {
        user_type_id: {
          [Op.eq]: 8
        }
      },
      {
        user_type_id: {
          [Op.eq]: 9
        }
      },
      {
        user_type_id: {
          [Op.eq]: 10
        }
      }
    ]
  };
  where.email = req.email;
  user.findOne({ 
    attributes: ['id', 'user_type_id', 'first_name', 'last_name', 'email', 'image_url', 'status', 'password'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      },
      {
        model: db.estateUser,
        attributes: ['estate_id'],
      },
      {
        model: db.divisionUser,
        attributes: ['estate_id', 'division_id'],
      },
      {
        model: db.shopUser,
        attributes: ['shop_id'],
      }
    ],
    where: where
  })
  .then(data => {
    if(!data){
      callBack({error:true, data:null, errorMessage:output});
    } 
    else{
var compareRes = bcrypt.compareSync(req.password, data.password);
      if(compareRes){
        var estates = [];
        var divisions = [];
        var shops = [];
        if(data.user_type_id===7 || data.user_type_id===8 || data.user_type_id===9){
          data.division_users.map(val=>{
            var found = false;
            estates.map(val1=>{
              if(val1===val.estate_id){
                found = true;
              }
            });
            if(!found){
              estates.push(val.estate_id);
            }
            divisions.push(val.division_id);
          });
          const val = {
            id: data.id,
            typeId: data.user_type.id,
            typeDescription: data.user_type.description,
            name: data.first_name+" "+data.last_name,
            email: data.email,
            imageUrl: data.image_url,
            status: data.status,
            estates: estates,
            divisions: divisions,
            shops: shops,
          };
          callBack({error:false, data:val, errorMessage:output});
        }
        else if(data.user_type_id===5 || data.user_type_id===6){
          var length = data.estate_users.length;
          var index = 1;
          data.estate_users.map(val=>{
            estates.push(val.estate_id);
            let retPromise = getDivisions(val.estate_id);
            retPromise.then(res=>{
              res.data.map(val1=>{
                divisions.push(val1.id);
              });
              if(index===length){
                const val = {
                  id: data.id,
                  typeId: data.user_type.id,
                  typeDescription: data.user_type.description,
                  name: data.first_name+" "+data.last_name,
                  email: data.email,
                  imageUrl: data.image_url,
                  status: data.status,
                  estates: estates,
                  divisions: divisions,
                  shops: shops,
                };
                callBack({error:false, data:val, errorMessage:output});
              }
              index++;
            }).catch(err=>{
              if(index===length){
                const val = {
                  id: data.id,
                  typeId: data.user_type.id,
                  typeDescription: data.user_type.description,
                  name: data.first_name+" "+data.last_name,
                  email: data.email,
                  imageUrl: data.image_url,
                  status: data.status,
                  estates: estates,
                  divisions: divisions,
                  shops: shops,
                };
                callBack({error:false, data:val, errorMessage:output});
              }
              index++;
            });
          });
        }
        else{
          const val = {
            id: data.id,
            typeId: data.user_type.id,
            typeDescription: data.user_type.description,
            name: data.first_name+" "+data.last_name,
            email: data.email,
            imageUrl: data.image_url,
            status: data.status,
            estates: estates,
            divisions: divisions,
            shops: shops,
          };
          callBack({error:false, data:val, errorMessage:output});
        }
      }
      else{
        callBack({error:true, data:null, errorMessage:output});
      }
    };
  })
  .catch(err => {
    callBack({error:true, data:null, errorMessage:output});
  });
};

exports.findByEmail = (req, callBack) => {
  var output = [];
  user.findOne({
    attributes: ['id', "user_type_id", 'first_name', 'last_name', 'phone', 'email', 'image_url', 'status'],
    include: [
      {
        model: db.userType,
        attributes: ['id', 'description']
      },
      {
        model: db.estateUser,
        attributes: ['estate_id'],
      },
      {
        model: db.divisionUser,
        attributes: ['estate_id', 'division_id'],
      }
    ],
    where: {
      email: req.email
    }
  })
  .then(data=>{
    if(!data){
      callBack({error:true, data:null, errorMessage:output});
    }
    else{
      var estates = [];
      var divisions = [];
      if(data.user_type_id===7 || data.user_type_id===8 || data.user_type_id===9){
        data.division_users.map(val=>{
          var found = false;
          estates.map(val1=>{
            if(val1===val.estate_id){
              found = true;
            }
          });
          if(!found){
            estates.push(val.estate_id);
          }
          divisions.push(val.division_id);
        });
        const val = {
          id: data.id,
          typeId: data.user_type.id,
          typeDescription: data.user_type.description,
          name: data.first_name+" "+data.last_name,
          email: data.email,
          imageUrl: data.image_url,
          status: data.status,
          estates: estates,
          divisions: divisions,
        };
        callBack({error:false, data:val, errorMessage:output});
      }
      else if(data.user_type_id===5 || data.user_type_id===6){
        var length = data.estate_users.length;
        var index = 1;
        data.estate_users.map(val=>{
          estates.push(val.estate_id);
          let retPromise = getDivisions(val.estate_id);
          retPromise.then(res=>{
            res.data.map(val1=>{
              divisions.push(val1.id);
            });
            if(index===length){
              const val = {
                id: data.id,
                typeId: data.user_type.id,
                typeDescription: data.user_type.description,
                name: data.first_name+" "+data.last_name,
                email: data.email,
                imageUrl: data.image_url,
                status: data.status,
                estates: estates,
                divisions: divisions,
              };
              callBack({error:false, data:val, errorMessage:output});
            }
            index++;
          }).catch(err=>{
            if(index===length){
              const val = {
                id: data.id,
                typeId: data.user_type.id,
                typeDescription: data.user_type.description,
                name: data.first_name+" "+data.last_name,
                email: data.email,
                imageUrl: data.image_url,
                status: data.status,
                estates: estates,
                divisions: divisions,
              };
              callBack({error:false, data:val, errorMessage:output});
            }
            index++;
          });
        });
      }
      else{
        const val = {
          id: data.id,
          typeId: data.user_type.id,
          typeDescription: data.user_type.description,
          name: data.first_name+" "+data.last_name,
          email: data.email,
          imageUrl: data.image_url,
          status: data.status,
          estates: estates,
          divisions: divisions,
        };
        callBack({error:false, data:val, errorMessage:output});
      }
    }
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

function getDivisions(estate_id){
  return new Promise((resolve, reject)=>{
    db.division.findAll({
      attributes: ['id'],
      where: {estate_id: estate_id}
    })
    .then(data=>{
      resolve({error: false, data: data});
    })
    .catch(err=>{
      reject({error: true, data: []});
    });
  });
};

function getShops(division_id){
  return new Promise((resolve, reject)=>{
    db.shop.findAll({
      attributes: ['id'],
      where: {division_id: division_id}
    })
    .then(data=>{
      resolve({error: false, data: data});
    })
    .catch(err=>{
      reject({error: true, data: []});
    });
  });
};

exports.signout = (req, callBack) => {
    user.findOne({ 
        attributes: ['id'],
        where: {
            id: req.id
        }
    })
    .then(data => {
        if(!data){
            const val = {
                status: 'invalid_user',
            };
            callBack({error:false, data:val, errorMessage:""});
        } 
        else{
            const val = {
                status: 'ok',
            };
            callBack({error:false, data:val, errorMessage:""});
        };
    })
    .catch(err => {
        callBack({error:true, data:null, errorMessage:""});
    });
};

exports.create = async (req, callBack) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.password, salt);
  user.findOne({
    attributes: ['id', 'code', 'barcode', 'email', 'phone'],
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
      user.create({
        user_type_id: req.typeId,
        code: req.code,
        barcode: req.barcode,
        first_name: req.firstName,
        last_name: req.lastName,
        phone: req.phone,
        email: req.email,
        address: req.address,
        password: hashedPassword,
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
        callBack({error:true, status: "", data:null, errorMessage:""});
      });
    }
    else{
      if(req.code===data.code){
        callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
      }
      else if(req.barcode===data.barcode){
        callBack({error:false, status: "duplicate_barcode", data:null, errorMessage:""});
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
    callBack({error:true, status: "", data:null, errorMessage:""});
  });
};

exports.edit = (req, callBack) => {
  user.findOne({
    attributes: ['id', 'code', 'barcode', 'phone', 'email'],
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
      user.update(
        {
          user_type_id: req.typeId,
          code: req.code,
          barcode: req.barcode,
          first_name: req.firstName,
          last_name: req.lastName,
          phone: req.phone,
          email: req.email,
          address: req.address,
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
        callBack({error:true, status: "", data:null, errorMessage:""});
      });
    }
    else{
      if(req.code===data.code){
        callBack({error:false, status: "duplicate_code", data:null, errorMessage:""});
      }
      else if(req.barcode===data.barcode){
        callBack({error:false, status: "duplicate_barcode", data:null, errorMessage:""});
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
      callBack({error:true, status: "", data:null, errorMessage:""});
  });
};

exports.find = (req, callBack) => {
    user.findOne({
        attributes: ['id', "user_type_id", 'code', 'barcode', 'first_name', 'last_name', 'phone', 'email', 'address', 'image_url', 'status'],
        include: [
          {
            model: db.userType,
            attributes: ['id', 'description']
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
        callBack({error:true, data:null, errorMessage:err});
    });
};

exports.editImage = (req, callBack) => {
    user.findOne({
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
        user.update(
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
    user.findOne({
        attributes: ['image_url'],
        where: {
          id: req.id
        }
    })
    .then(data=>{
        if(data.image_url!=="none"){
            fs.unlink(appRoot + "/" + data.image_url, (err) => {
              if(err){
                callBack({error:true, data:null, errorMessage:err});
              }
              else{
                  user.update(
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

exports.resetPassword = async (req, callBack) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.password, salt);
  user.update(
    {
        password: hashedPassword,
        status: 'active',
    }, 
    {
      where: {
        id: req.id
      }
    }
  )
  .then(data=>{
    callBack({error:false, data:null, errorMessage:""});
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:err});
  });
};