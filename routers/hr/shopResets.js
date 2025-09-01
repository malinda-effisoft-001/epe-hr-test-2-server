const router = require("express").Router();
const controller = require('../../controllers/hr/shopResets');

router.post("/search", async (req, res) => {
  await controller.search(req.body.search_data, req.body.rpp, req.body.page, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/issue", async (req, res) => {
  await controller.searchBulk(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/find", async (req, res) => {
  await controller.findOne(req.body, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/get-debits", async (req, res) => {
  await controller.getDebits(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/get-advances", async (req, res) => {
  await controller.getAdvances(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/get-purchases", async (req, res) => {
  await controller.getPurchases(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/get-food-orders", async (req, res) => {
  await controller.getFoodOrders(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/reset", async (req, res) => {
  await controller.reset(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

module.exports = router;