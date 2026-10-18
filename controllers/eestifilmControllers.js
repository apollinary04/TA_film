const mysql = require('mysql2/promise');

// Eesti filmide avaleht
function eestifilm(req, res) {
    res.render('eestifilm');
}

// Inimeste nimekirja kuvamine
async function eestifilmInimesed(req, res) {
    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'if26_polina_rajevskaja'
        });

        const sqlReq = 'SELECT * FROM person ORDER BY last_name';
        const [sqlRes] = await conn.execute(sqlReq);

        console.log(sqlRes);
        res.render('eestifilminimesed', { personList: sqlRes });
    } catch (err) {
        console.log('Viga andmebaasist lugemisel: ' + err);
        res.render('eestifilminimesed', { personList: [] });
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

// Inimese lisamise vormi kuvamine
function eestifilmInimesedLisa(req, res) {
    res.render('eestifilmiinimesed_add', {
        notice: 'Ootan sisestust!',
        firstNameInput: '',
        lastNameInput: '',
        bornInput: '',
        deceasedInput: ''
    });
}

// Uue inimese lisamine
async function eestifilmInimesedLisaPost(req, res) {
    const firstNameInput = req.body.firstNameInput || '';
    const lastNameInput = req.body.lastNameInput || '';
    const bornInput = req.body.bornInput || '';
    const deceasedInput = req.body.deceasedInput || '';

    const now = new Date();
    const bornDate = new Date(bornInput);

    const renderForm = (notice) => res.render('eestifilmiinimesed_add', {
        notice,
        firstNameInput,
        lastNameInput,
        bornInput,
        deceasedInput
    });

    if (!firstNameInput.trim() || !lastNameInput.trim() ||
        !bornInput || isNaN(bornDate.getTime()) || bornDate > now) {
        return renderForm('Andmed on puudulikud või kuupäev ei ole korrektne!');
    }

    let conn;

    try {
        conn = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'if26_polina_rajevskaja'
        });

        const sqlReq = 'INSERT INTO person (first_name, last_name, birth_date, death_date) VALUES (?,?,?,?)';
        let deceasedDateValue = null;

        if (deceasedInput !== '') {
            const deceasedDate = new Date(deceasedInput);

            if (isNaN(deceasedDate.getTime()) ||
                deceasedDate > now ||
                deceasedDate < bornDate) {
                return renderForm('Surmakuupäev ei ole korrektne!');
            }

            deceasedDateValue = deceasedInput;
        }

        await conn.execute(sqlReq, [
            firstNameInput,
            lastNameInput,
            bornInput,
            deceasedDateValue
        ]);

        res.render('eestifilmiinimesed_add', {
            notice: 'Andmed salvestati! Ootan uut sisestust!',
            firstNameInput: '',
            lastNameInput: '',
            bornInput: '',
            deceasedInput: ''
        });
    } catch (err) {
        console.log('Viga andmebaasiga suhtlemisel: ' + err);
        renderForm('Tekkis viga, andmeid ei salvestatud!');
    } finally {
        if (conn) {
            await conn.end();
        }
    }
}

// Žanri lisamise vormi kuvamine
function eestifilmGenreLisa(req, res) {
    res.render('genre_add', {
        notice: 'Ootan sisestust!',
        genreName: '',
        description: ''
    });
}

// Žanri vormi saatmine
function eestifilmGenreLisaPost(req, res) {
    res.render('genre_add', { notice: 'Ootan sisestust!' });
}

// Elukutse lisamise vormi kuvamine
function eestifilmProfessionLisa(req, res) {
    res.render('profession_add', {
        notice: 'Ootan sisestust!',
        professionName: ''
    });
}

// Elukutse vormi saatmine
function eestifilmProfessionLisaPost(req, res) {
    res.render('profession_add', { notice: 'Ootan sisestust!' });
}

module.exports = {
    eestifilm,
    eestifilmInimesed,
    eestifilmInimesedLisa,
    eestifilmInimesedLisaPost,
    eestifilmGenreLisa,
    eestifilmGenreLisaPost,
    eestifilmProfessionLisa,
    eestifilmProfessionLisaPost
};
