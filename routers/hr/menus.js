const router = require("express").Router();
const controller = require('../../controllers/hr/menus');

router.post("/create", async (req, res)=>{
    await controller.create(req, ({error, status, data, errorMessage})=>{
        res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
    });
});

router.post("/edit", async (req, res) => {
    await controller.edit(req, ({error, status, data, errorMessage})=>{
        res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
    });
});

router.post("/active", async (req, res) => {
    await controller.findActive(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
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

module.exports = router;