const mysql = require('mysql2/promise');

async function connect() {
    return await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'if26_polina_rajevskaja'
    });
}

// Seoste lisamise vorm
async function seosLisa(req, res) {
    let connection;
    try {
        connection = await connect();

        const [people] = await connection.query(
            'SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name'
        );
        const [movies] = await connection.query(
            'SELECT id, title FROM movie ORDER BY title'
        );
        const [positions] = await connection.query(
            'SELECT id, name FROM position ORDER BY name'
        );

        res.render('seos_add', {
            people,
            movies,
            positions,
            notice: ''
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Seoste lisamise lehe laadimine ebaõnnestus.');
    } finally {
        if (connection) await connection.end();
    }
}

// Uue seose salvestamine
async function seosLisaPost(req, res) {
    let connection;
    try {
        connection = await connect();

        const [people] = await connection.query(
            'SELECT id, first_name, last_name FROM person ORDER BY last_name, first_name'
        );
        const [movies] = await connection.query(
            'SELECT id, title FROM movie ORDER BY title'
        );
        const [positions] = await connection.query(
            'SELECT id, name FROM position ORDER BY name'
        );

        const personId = Number(req.body.person_id);
        const movieId = Number(req.body.movie_id);
        const positionId = Number(req.body.position_id);
        const selectedPosition = positions.find(p => p.id === positionId);
        const role = String(req.body.role || '').trim();

        let notice = '';

        if (
            !people.some(p => p.id === personId) ||
            !movies.some(m => m.id === movieId) ||
            !selectedPosition
        ) {
            notice = 'Palun vali inimene, film ja amet.';
        } else if (selectedPosition.name === 'näitleja' && !role) {
            notice = 'Palun sisesta näitleja roll.';
        } else {
            const roleValue = selectedPosition.name === 'näitleja'
                ? role
                : null;

            const [existing] = await connection.execute(
                'SELECT person_id FROM person_in_movie WHERE person_id = ? AND movie_id = ? AND position_id = ? AND role <=> ?',
                [personId, movieId, positionId, roleValue]
            );

            if (existing.length > 0) {
                notice = 'Selline seos on juba olemas.';
            } else {
                await connection.execute(
                    'INSERT INTO person_in_movie (person_id, movie_id, position_id, role) VALUES (?, ?, ?, ?)',
                    [personId, movieId, positionId, roleValue]
                );
                notice = 'Seos on edukalt salvestatud.';
            }
        }

        res.render('seos_add', {
            people,
            movies,
            positions,
            notice
        });
    } catch (err) {
        console.log(err);
        res.status(500).send('Seose salvestamine ebaõnnestus.');
    } finally {
        if (connection) await connection.end();
    }
}

// Kõigi seoste kuvamine
async function seosed(req, res) {
    let connection;

    try {
        connection = await connect();

        const [seosedList] = await connection.query(`
            SELECT
                p.first_name,
                p.last_name,
                m.title,
                pos.name AS position_name,
                pim.role
            FROM person_in_movie pim
            JOIN person p ON pim.person_id = p.id
            JOIN movie m ON pim.movie_id = m.id
            JOIN position pos ON pim.position_id = pos.id
            ORDER BY m.title, p.last_name, p.first_name
        `);

        res.render('seosed', { seosedList });
    } catch (err) {
        console.log(err);
        res.status(500).send('Seoste laadimine ebaõnnestus.');
    } finally {
        if (connection) await connection.end();
    }
}

module.exports = {
    seosLisa,
    seosLisaPost,
    seosed
};
