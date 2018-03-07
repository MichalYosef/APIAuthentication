const Joi = require('joi'); // validations

module.exports = {
    
    validateParam: (schema, paramName) => 
    {
        return (req, res, next) => 
        {
            console.log( 'req.params' ,req.params);
            const result = Joi.validate( {param: req['params'][paramName]} ,schema);
            if( result.error)
            {
                return res.status(400).json(result.error);
            }
            else
            {
                if( ! req.value)
                    req.value = {};

                if( ! req.value['params'])
                    req.value['params'] = {};

                req.value['params'][paramName] = result.value.param;

                next();
            }
        }

    },

    validateBody : (schema) =>
    {
        return (req, res, next) =>
        {
            const result = Joi.validate( req.body, schema);

            if( result.error)
            {
                return res.status(400).json(result.error);
            }
           
            if( ! req.value)
                req.value = {};

            if( ! req.value['body'])
                req.value['body'] = {};

            req.value['body'] = result.value;
            next();
        
        };
    },

    schemas: {
        authSchema: Joi.object().keys({
            email: Joi.string().email().required(), 
            password: Joi.string().required()
        }),
        // userSchema for post / put
        // userSchema : Joi.object().keys ({
        //     firstName: Joi.string().required(),
        //     lastName: Joi.string().required(),
        //     email: Joi.string().email().required(),
        // }),

        // // userSchema for patch (update)
        // userOptionalSchema : Joi.object().keys ({
        //     firstName: Joi.string(),
        //     lastName: Joi.string(),
        //     email: Joi.string().email(),
        // }),

        
        // userCarSchema : Joi.object().keys ({
        //     make: Joi.string().required(),
        //     model: Joi.string().required(),
        //     year: Joi.number().required(),
            
        // }),

        // carSchema : Joi.object().keys ({
        //     seller: Joi.string().regex(/^[0-9a-fA-F]{24}/).required(),
        //     make: Joi.string().required(),
        //     model: Joi.string().required(),
        //     year: Joi.number().required(),
            
        // }),

        // putCarSchema : Joi.object().keys ({
            
        //     make: Joi.string().required(),
        //     model: Joi.string().required(),
        //     year: Joi.number().required(),
            
        // }),

        // patchCarSchema : Joi.object().keys ({
            
        //     make: Joi.string(),
        //     model: Joi.string(),
        //     year: Joi.number(),
            
        // }),

        idSchema : Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}/).required()
        })
        
    }
}
