const db = require('../../models/sequelize');
const periodAttendance = db.periodAttendance;
const Op = db.Sequelize.Op;
const { parse } = require('csv-parse');
const fs = require('fs');

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
  if(req.user_type===5){
    where.user_id = req.user_id_1;
  }
  if(req.user_type===6 || req.user_type===7 || req.user_type===8 || req.user_type===9 || req.user_type===10){
    where.id = {
      [Op.in]: [0]
    };
  }
  if(rpp===0){
    periodAttendance.findAndCountAll({
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
      const { count, rows } = await periodAttendance.findAndCountAll({
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
  periodAttendance.findOne({
    attributes: ['id', 'u_date', 'u_time', 'from_date', 'to_date', 'user_id', 'estate_id', 'division_id', 'job_id', 'status'],
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
        model: db.periodAttendancesItem,
        attributes: ['id', 'employee_id', 'days', 'ot', 'weight', 'status'],
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
    console.log(err);
    callBack({error:true, data:null, errorMessage:''});
  });
};

exports.uploadFile = (req, callBack) => {
  var u_date = getDate();
  var u_time = getTime();
  var where = {
    [Op.or]:[
      {
        from_date: {
          [Op.between]: [req.body.from_date, req.body.to_date]
        }
      },
      {
        to_date: {
          [Op.between]: [req.body.from_date, req.body.to_date]
        }
      }
    ]
  };
  where.estate_id = req.body.estate_id;
  where.division_id = req.body.division_id;
  where.job_id = req.body.job_id;
  periodAttendance.findOne({
    attributes: ['id'],
    where: where
  })
  .then(data=>{
    if(!data){
      db.estate.findAll({
        attributes: ['id', 'description'],
        include: [
          {
            model: db.division,
            attributes: ['id', 'description']
          },
        ],
        where: {status: 'active'}
      })
      .then(estates=>{
        db.employee.findAll({
          attributes: ['id', 'epf_no', 'first_name', 'last_name'],
          where: {status: 'active'}
        })
        .then(employees=>{
          var job_id = req.body.job_id;
          var from_date = req.body.from_date;
          var to_date = req.body.to_date;
          var estate_id = req.body.estate_id;
          var division_id = req.body.division_id;
          var path = (req.file.path).replace(appRoot + "/", "");
          path = (path).replace(appRoot + '\\', "");
          path = (path).replaceAll('\\', "/");
          const results = [];
          var feedBack = [];
          fs.createReadStream(path).pipe(parse({
            comment: '#',
            columns: true
          })).on('data', (data)=>{
            results.push(data);
          }).on('error', (err4)=>{
            callBack({error:true, data:[], errorMessage:''});
          }).on('end', ()=>{
            if(results.length===0){
              callBack({error:false, data:feedBack, errorMessage:''});
            }
            var data_out = [];
            for(let i=0; i<results.length; i++){
              var val = results[i];
              var error = false;
              var error_msg = '';
              var temp = {};
              if(val['EPF No'].length===0){
                error = true;
                error_msg = 'Invalid EPF Number, ';
                temp.epf_no = val['EPF No'];
              }
              else{
                var employeeIndex = employees.findIndex(val1=>val1.epf_no===val['EPF No'].trimStart().trimEnd());
                if(employeeIndex===-1){
                  error = true;
                  error_msg = 'Invalid Employee - '+val['EPF No']+', ';
                  temp.epf_no = val['EPF No'];
                }
                else{
                  temp.employee_id = employees[employeeIndex].id;
                  temp.employee_description = employees[employeeIndex].first_name+' '+employees[employeeIndex].last_name;
                  temp.epf_no = employees[employeeIndex].epf_no;
                }
              }
              if(!error){
                if(val['Estate Name'].length===0){
                  error = true;
                  error_msg = 'Invalid Estate, ';
                }
                else{
                  var estateIndex = estates.findIndex(val1=>val1.description===val['Estate Name'].trimStart().trimEnd());
                  if(estateIndex===-1){
                    error = true;
                    error_msg = 'Invalid Estate - '+val['Estate Name']+', ';
                  }
                  else{
                    temp.estate_id = estates[estateIndex].id;
                    if(val['Division Name']){
                      if(val['Division Name'].length===0){
                        error = true;
                        error_msg = 'Invalid Division, ';
                      }
                      else{
                        var divisions = estates[estateIndex].divisions;
                        var divisionIndex = divisions.findIndex(val1=>val1.description===val['Division Name'].trimStart().trimEnd());
                        if(divisionIndex===-1){
                          error = true;
                          error_msg = 'Invalid Division - '+val['Division Name']+', ';
                        }
                        else{
                          temp.division_id = divisions[divisionIndex].id;
                        }
                      }
                    }
                    else{
                      error = true;
                      error_msg = 'Invalid Division, ';
                    }
                  }
                }
              }
              if(!error){
                var days = val['Man Days'].trimStart().trimEnd();
                try{
                  temp.days = parseFloat(days);
                }
                catch(e){
                  error = true;
                  error_msg = 'Invalid Days - '+val['Man Days']+', ';
                }
              }
              if(!error){
                var ot = val['Over Time'].trimStart().trimEnd();
                try{
                  temp.ot = parseFloat(ot);
                }
                catch(e){
                  error = true;
                  error_msg = 'Invalid OT - '+val['Over Time']+', ';
                }
              }
              if(!error){
                var weight = val['No of Units'].trimStart().trimEnd();
                try{
                  temp.weight = parseFloat(weight);
                }
                catch(e){
                  error = true;
                  error_msg = 'Invalid Weight - '+val['No of Units']+', ';
                }
              }
              if(!error){
                if(temp.days<=0){
                  error = true;
                  error_msg = 'Invalid Days, ';
                }
              }
              var add = false;
              if(!error){
                if(parseInt(temp.estate_id+'')===parseInt(estate_id+'') && parseInt(temp.division_id+'')===parseInt(division_id+'')){
                  add = true;
                }
              }
              if(add){
                if(!error){
                  temp.error = false;
                  temp.errorMsg = error_msg;
                  data_out.push(temp);
                }
                else{
                  temp.error = true;
                  temp.errorMsg = error_msg;
                  data_out.push(temp);
                }
              }
            }
            periodAttendance.create({
              u_date: u_date,
              u_time: u_time,
              user_id: req.body.user_id,
              estate_id: req.body.estate_id,
              division_id: req.body.division_id,
              job_id: req.body.job_id,
              from_date: req.body.from_date,
              to_date: req.body.to_date,
              status: 'finalized'
            })
            .then(data1=>{
              var period_attendance_id = data1.id;
              var result = {id: data1.id, u_date: u_date, u_time: u_time, status: 'finalized'};
              for(let i=0; i<data_out.length; i++){
                var temp = data_out[i];
                temp.ref = i;
                if(temp.error){
                  var feed_back_temp = {};
                  feed_back_temp.epf_no = temp.epf_no;
                  feed_back_temp.error = true;
                  feed_back_temp.errorMsg = temp.errorMsg;
                  feed_back_temp.status = 'error';
                  feedBack.push(feed_back_temp);
                  if(feedBack.length===data_out.length){
                    callBack({error:false, data:{result, feedBack}, errorMessage:''});
                  }
                }
                else{
                  let retPromise = createItem(period_attendance_id, estate_id, division_id, from_date, to_date, job_id, temp);
                  retPromise.then(res=>{
                    var feed_back_temp = {};
                    feed_back_temp.epf_no = res.data;
                    feed_back_temp.error = false;
                    feed_back_temp.errorMsg = '';
                    feed_back_temp.status = 'done';
                    feedBack.push(feed_back_temp);
                    if(feedBack.length===data_out.length){
                      callBack({error:false, data:{result, feedBack}, errorMessage:''});
                    }
                  }).catch(err=>{
                    var feed_back_temp = {};
                    feed_back_temp.epf_no = err.data;
                    feed_back_temp.error = true;
                    feed_back_temp.errorMsg = err.errorMsg;
                    feed_back_temp.status = 'error';
                    feedBack.push(feed_back_temp);
                    if(feedBack.length===data_out.length){
                      callBack({error:false, data:{result, feedBack}, errorMessage:''});
                    }
                  });
                }
              }
            })
            .catch(err1=>{
              callBack({error:true, data:null, errorMessage:''});
            });
          });
        })
        .catch(err3=>{
          callBack({error:true, data:null, errorMessage:''});
        });
       })
      .catch(err2=>{
        callBack({error:true, data:null, errorMessage:''});
      });
    }
    else{
      callBack({error:true, data:'data_exists', errorMessage:''});
    }
  })
  .catch(err=>{
    callBack({error:true, data:null, errorMessage:''});
  });
};

function createItem(period_attendance_id, estate_id, division_id, from_date, to_date, job_id, item){
  return new Promise((resolve, reject)=>{
    let where = {};
    where = {
      [Op.or]:[
        {
          from_date: {
            [Op.between]: [from_date, to_date]
          }
        },
        {
          to_date: {
            [Op.between]: [from_date, to_date]
          }
        }
      ]
    };
    where.estate_id = estate_id;
    where.division_id = division_id;
    where.job_id = job_id;
    where.employee_id = item.employee_id;
    db.periodAttendancesItem.findOne({
      attributes: ['id'],
      where: where
    })
    .then(data=>{
      if(data){
        reject({error: true, data: item.epf_no, errorMsg: 'Item Exists'});
      }
      else{
        db.periodAttendancesItem.create({
          period_attendance_id: period_attendance_id,
          from_date: from_date,
          to_date: to_date,
          estate_id: estate_id,
          division_id: division_id,
          job_id: job_id,
          employee_id: item.employee_id,
          days: item.days,
          ot: item.ot,
          weight: item.weight,
          status: 'done',
        })
        .then(data1=>{
          resolve({error: false, data: item.epf_no});
        })
        .catch(err1=>{
          reject({error: true, data: item.epf_no, errorMsg: 'Server Error'});
        });
      }
    })
    .catch(err=>{
      reject({error: true, data: item.epf_no, errorMsg: 'Server Error'});
    });
  });
};

exports.searchBulk = (req, callBack) => {
  let where = {};
  where = {
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
    attributes: ['id', 'period_attendance_id', 'from_date', 'to_date', 'estate_id', 'division_id', 'job_id', 'employee_id', 'days', 'ot', 'weight', 'status'],
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
    where: where
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