const router = require("express").Router();
const controller = require('../../controllers/hr/shopDebits');

router.post("/search", async (req, res) => {
  await controller.search(req.body.search_data, req.body.rpp, req.body.page, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/issue", async (req, res) => {
  await controller.issue(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/find", async (req, res) => {
  await controller.findOne(req.body, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

module.exports = router;