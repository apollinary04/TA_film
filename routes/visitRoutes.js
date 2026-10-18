const express = require('express');
const router = express.Router();

const {
    regvisit,
    regvisitPost,
    viimaneKulastus
} = require('../controllers/visitControllers');

// Külastuste avaleht
router.get('/', viimaneKulastus);

// Külastuse registreerimine
router.get('/regvisit', regvisit);
router.post('/regvisit', regvisitPost);

module.exports = router;
