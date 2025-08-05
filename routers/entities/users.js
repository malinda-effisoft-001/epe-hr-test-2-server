const router = require("express").Router();
const controller = require('../../controllers/entities/users');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, appRoot + "/uploads/images/users/");
    },
    filename: function(req, file, cb){
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, 'user-image-' + Date.now()+ '.' +extension)
    }
});
const upload = multer({
    storage:storage,
});

router.post("/active-types", async (req, res) => {
    await controller.activeTypes(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/get-for-hr", async (req, res) => {
    await controller.getForHr(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/get-for-estates", async (req, res) => {
    await controller.getForEstates(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/get-for-divisions", async (req, res) => {
    await controller.getForDivisions(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/get-for-shops", async (req, res) => {
    await controller.getForShops(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/search", async (req, res) => {
    await controller.search(req.body.search_data, req.body.rpp, req.body.page, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/signin-admin", async (req, res) => {
    await controller.signinAdmin(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/signin", async (req, res) => {
    await controller.signin(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/signout", async (req, res) => {
    await controller.signout(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/create", async (req, res)=>{
    await controller.create(req.body, ({error, status, data, errorMessage})=>{
        res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
    });
});

router.post("/edit", async (req, res)=>{
    await controller.edit(req.body, ({error, status, data, errorMessage})=>{
        res.status(200).json({error:error, status:status, data:data, errorMessage:errorMessage});
    });
});

router.post("/find", async (req, res) => {
    await controller.find(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/find-by-email", async (req, res) => {
    await controller.findByEmail(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/edit-image", upload.single("imageUrl"), async (req, res) => {
    await controller.editImage(req, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/delete-image", async (req, res) => {
    await controller.deleteImage(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/reset-password", async (req, res) => {
    await controller.resetPassword(req.body, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

module.exports = router;