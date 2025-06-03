// backend/src/config/db.js
require('dotenv').config();

const { Model, snakeCaseMappers } = require('objection');
const Knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment];

const db = Knex(config);

// 1) Обязательно подключаем wrapIdentifier и postProcessResponse **до** Model.knex:
db.client.config.wrapIdentifier      = snakeCaseMappers().wrapIdentifier;
db.client.config.postProcessResponse = snakeCaseMappers().postProcessResponse;

// 2) Только после этого регистрируем Knex в Objection:
Model.knex(db);

module.exports = db;
