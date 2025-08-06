const router = require("express").Router();
const controller = require('../../controllers/hr/foodOrders');

router.post("/create", async (req, res)=>{
  await controller.create(req, ({error, status, data, errorMessage})=>{
    res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
  });
});

router.post("/edit", async (req, res)=>{
  await controller.edit(req, ({error, status, data, errorMessage})=>{
    res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
  });
});

router.post("/issue", async (req, res)=>{
  await controller.issue(req, ({error, status, data, errorMessage})=>{
    res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
  });
});

router.post("/cancel", async (req, res)=>{
  await controller.cancel(req, ({error, status, data, errorMessage})=>{
    res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
  });
});

router.post("/search", async (req, res) => {
  await controller.search(req.body.search_data, req.body.rpp, req.body.page, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/find", async (req, res) => {
  await controller.findOne(req.body, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/find-for-employee", async (req, res) => {
  await controller.findForEmployee(req.body, ({error, status, data, errorMessage})=>{
    res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
  });
});

router.post("/get-report", async (req, res) => {
  await controller.getReport(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

module.exports = router;