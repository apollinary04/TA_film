const fs = require('fs').promises;

const regTextRef = 'public/txt/visits.txt';

// Külastuste registreerimise lehe kuvamine
function regvisit(req, res) {
    res.render('regvisit');
}

// Uue külastuse registreerimine
async function regvisitPost(req, res) {
    try {
        await fs.appendFile(regTextRef, req.body.nameInput + ';');
        res.render('regvisit');
    } catch (err) {
        console.log(err);
        res.render('regvisit');
    }
}

// Viimase külastuse kuvamine
async function viimaneKulastus(req, res) {
    try {
        const data = await fs.readFile(regTextRef, 'utf8');
        const visits = data.split(';').map(name => name.trim()).filter(Boolean);

        res.render('viimane_kulastus', {
            lastVisit: visits.length
                ? visits[visits.length - 1]
                : 'Külastusi pole veel registreeritud.'
        });
    } catch (err) {
        res.render('viimane_kulastus', {
            lastVisit: 'Külastuste andmeid ei leitud.'
        });
    }
}

module.exports = {
    regvisit,
    regvisitPost,
    viimaneKulastus
};
