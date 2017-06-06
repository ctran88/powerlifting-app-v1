'use strict';

module.exports = {

    session: function(req, res, next) {

        req.check('metadata').isJSON();
        req.check('metadata.day').notEmpty().isInt({
            min: 1,
            max: 7
        });
        req.check('mainLift').matches('squat', 'bench press', 'deadlift');
        req.check('mainVariation').isArray().notEmptyArray();
        req.check('mainScheme').isArrayObjects();
        req.check('mainScheme.sets').isInt({
            min: 1
        });
        req.check('mainScheme.reps').isInt({
            min: 1
        });
        req.check('mainScheme.weight').isInt({
            min: 1
        });
        req.check('mainScheme.rpe').isInt({
            min: 1,
            max: 10
        });
        req.check('mainScheme.percent.type').isInt({
            min: 1,
            max: 100
        });
        req.check('mainScheme.percent.of').match('ts', '1rm');
        req.check('mainScheme.backoff').isBoolean();
        req.check('mainScheme.workupSets').isBoolean();
        req.check('accessories').isArrayObjects();
        req.check('accessories.exercise').isAlphanumeric();
        req.check('accessories.sets').isInt({
            min: 1
        });
        req.check('accessories.reps').isInt({
            min: 1
        });
        req.check('accessories.weight').isInt({
            min: 1
        });
        req.check('accessories.rpe').isInt({
            min: 1,
            max: 10
        });
        req.check('accessories.percent.type').isInt({
            min: 1,
            max: 100
        });
        req.check('accessories.percent.of').match('ts', '1rm');
        req.check('accessories.backoff').isBoolean();
        req.check('accessories.workupSets').isBoolean();

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {
                var errors = result.mapped();
                return res.status(400).json(errors);
            } else {
                return next();
            }

        });

    }

};
