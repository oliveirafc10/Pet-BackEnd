const express = require('express')
const { celebrate, Segments, Joi } = require ('celebrate');

const LoginController = require('./controllers/LoginController')
const OngController = require('./controllers/OngController')
const OcorrenciasController = require('./controllers/OcorrenciaController')
const PerfilController = require('./controllers/PerfilController')


const routes = express.Router();

routes.get('/ongs', OngController.index);
routes.post('/ongs', celebrate({
  [Segments.BODY]: Joi.object().keys({
    nome: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.string().required().min(10).max(11),
    cidade: Joi.string().required(),
    uf: Joi.string().required().length(2),
  })
}), OngController.create);

routes.post('/login', LoginController.create);

routes.get('/perfil', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().required(),
  }).unknown(),   
}), PerfilController.index)
   
routes.get('/ocorrencias', celebrate({
  [Segments.QUERY]: Joi.object().keys({ 
    page: Joi.number(),
  })
}), OcorrenciasController.index);
routes.post('/ocorrencias', OcorrenciasController.create);
routes.delete('/ocorrencias/:id', celebrate({ 
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required(),
  })
 }), OcorrenciasController.delete);

module.exports = routes;