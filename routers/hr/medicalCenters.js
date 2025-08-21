const router = require("express").Router();
const controller = require('../../controllers/hr/medicalCenters');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, appRoot + "/uploads/images/medical-centers/");
    },
    filename: function(req, file, cb){
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, 'medical-center-image-' + Date.now()+ '.' +extension)
    }
});
const upload = multer({
    storage:storage
});

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

router.post("/delete-image", async (req, res) => {
    await controller.deleteImage(req, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/edit-image", upload.single("imageUrl"), async (req, res) => {
    await controller.editImage(req, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
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

router.post("/add-user", async (req, res)=>{
    await controller.addUser(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/remove-user", async (req, res)=>{
    await controller.removeUser(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/change-user-status", async (req, res)=>{
    await controller.changeUserStatus(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

module.exports = router;