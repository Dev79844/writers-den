const express = require('express')
const {getTags} = require('../controllers/tagsController')

const router = express.Router()

router.get("/tags", getTags)

module.exports = router