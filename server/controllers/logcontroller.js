const router = require('express').Router();
const validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require('../models');
const Log = require('../models/log');

router.post('/', validateJWT, async (req, res) => {
   const { description, definition, result } = req.body.log;
   const { id } = req.user;
   const logEntry = {
       description,
       definition,
       result,
       owner_id: id
   }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog)
    } catch (err) {
        res.status(500).json({
            error: err
        })
    }
});

router.get('/', validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const results = await LogModel.findAll({
            where: { id: req.params. id }, returning: true
        });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.put('/:id', async (req, res) => {
    const { description, definition, result } = req.body.log;
    try {
        await LogModel.update(
            { description, definition, result },
            { where: { id: req.params.id }, returning: true }
        )
        .then((result) => {
            res.status(200).json({
                message: 'Log successfully updated.',
                updatedLog: result
            })
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to update log ${err}`
        })
    }
});

router.delete('/:id', validateJWT, async (req, res) => {
    const ownerId = req.user.id;
    const logId = req.params.id;

    try {
        const query = {
            where: {
                id: logId,
                owner_id: ownerId
            }
        };
        await LogModel.destroy(query);
        res.status(200).json({ message: 'Log entry deleted' })
    } catch (err) {
        res.status(500).json({ error: err })
    }
})

module.exports = router;