
const pool = require('../config/db');

const createEthicsMarksheet = async (req, res) => {
    const {
        projectid,
        judgeid,
        type,
        overallseverity,
        judgecomment,
        section1, section2, section3, section4, section5,
        section6, section7, section8, section9, section10,
        section11, section12, section13, section14, section15,
        section16, section17, section18, section19, section20,
        section21, section22, section23, section24, section25
    } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO ethicsmarksheets (projectid, judgeid, type, overallseverity, judgecomment, section1, section2, section3, section4, section5, section6, section7, section8, section9, section10, section11, section12, section13, section14, section15, section16, section17, section18, section19, section20, section21, section22, section23, section24, section25) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) RETURNING *',
            [
                projectid, judgeid, type, overallseverity, judgecomment,
                section1, section2, section3, section4, section5,
                section6, section7, section8, section9, section10,
                section11, section12, section13, section14, section15,
                section16, section17, section18, section19, section20,
                section21, section22, section23, section24, section25
            ]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllEthicsMarksheets = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ethicsmarksheets');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getEthicsMarksheetById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM ethicsmarksheets WHERE ethicsmarksheetid = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ethics marksheet not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateEthicsMarksheet = async (req, res) => {
    const { id } = req.params;
    const {
        overallseverity,
        judgecomment,
        section1, section2, section3, section4, section5,
        section6, section7, section8, section9, section10,
        section11, section12, section13, section14, section15,
        section16, section17, section18, section19, section20,
        section21, section22, section23, section24, section25
    } = req.body;

    try {
        const result = await pool.query(
            'UPDATE ethicsmarksheets SET overallseverity = $1, judgecomment = $2, section1 = $3, section2 = $4, section3 = $5, section4 = $6, section5 = $7, section6 = $8, section7 = $9, section8 = $10, section9 = $11, section10 = $12, section11 = $13, section12 = $14, section13 = $15, section14 = $16, section15 = $17, section16 = $18, section17 = $19, section18 = $20, section19 = $21, section20 = $22, section21 = $23, section22 = $24, section23 = $25, section24 = $26, section25 = $27 WHERE ethicsmarksheetid = $28 RETURNING *',
            [
                overallseverity, judgecomment,
                section1, section2, section3, section4, section5,
                section6, section7, section8, section9, section10,
                section11, section12, section13, section14, section15,
                section16, section17, section18, section19, section20,
                section21, section22, section23, section24, section25,
                id
            ]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ethics marksheet not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteEthicsMarksheet = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM ethicsmarksheets WHERE ethicsmarksheetid = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ethics marksheet not found' });
        }
        res.status(200).json({ message: 'Ethics marksheet deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createEthicsMarksheet,
    getAllEthicsMarksheets,
    getEthicsMarksheetById,
    updateEthicsMarksheet,
    deleteEthicsMarksheet,
};
