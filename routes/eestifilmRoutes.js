const express = require('express');
const router = express.Router();

const { seosLisa, seosLisaPost, seosed } = require('../controllers/seosControllers');

const {
    eestifilm,
    eestifilmInimesed,
    eestifilmInimesedLisa,
    eestifilmInimesedLisaPost,
    eestifilmGenreLisa,
    eestifilmGenreLisaPost,
    eestifilmProfessionLisa,
    eestifilmProfessionLisaPost
} = require('../controllers/eestifilmControllers');

// Eesti filmide marsruudid
router.get('/', eestifilm);

router.get('/inimesed', eestifilmInimesed);

router.get('/inimesed_add', eestifilmInimesedLisa);
router.post('/inimesed_add', eestifilmInimesedLisaPost);

router.get('/genre_add', eestifilmGenreLisa);
router.post('/genre_add', eestifilmGenreLisaPost);

router.get('/profession_add', eestifilmProfessionLisa);
router.post('/profession_add', eestifilmProfessionLisaPost);

router.get('/seos_add', seosLisa);
router.post('/seos_add', seosLisaPost);
router.get('/seosed', seosed);

module.exports = router;
