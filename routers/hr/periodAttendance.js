const router = require("express").Router();
const controller = require('../../controllers/hr/periodAttendance');
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, appRoot + "/uploads/data/");
    },
    filename: function(req, file, cb){
        let extArray = file.mimetype.split("/");
        let extension = extArray[extArray.length - 1];
        cb(null, 'period-attendance-' + Date.now()+ '.' +extension)
    }
});
const upload = multer({
    storage:storage
});

router.post("/upload-file", upload.single("csvFile"), async (req, res) => {
    await controller.uploadFile(req, ({error, data, errorMessage})=>{
        res.status(200).json({error:error, data:data, errorMessage:errorMessage});
    });
});

router.post("/search", async (req, res) => {
  await controller.search(req.body.search_data, req.body.rpp, req.body.page, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/search-bulk", async (req, res) => {
  await controller.searchBulk(req.body.search_data, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

router.post("/find", async (req, res) => {
  await controller.findOne(req.body, ({error, data, errorMessage})=>{
    res.status(200).json({error:error, data:data, errorMessage:errorMessage});
  });
});

module.exports = router;