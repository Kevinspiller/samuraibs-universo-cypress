/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const { Pool } = require('pg') //importação do node-postgres

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const configJson = require(config.configFile)

  const pool = new Pool(configJson.dbConfig)

  on('task', { //criação da promessa, para abortar quando der erro ou resolver a remoção do usuário (DELETE)
    removeUser(email) {
      return new Promise(function (resolve) {
        pool.query('DELETE FROM public.users WHERE email = $1', [email], function (error, result) {
          if (error) {
            throw error
          }
          resolve({ sucess: result })
        })
      })
    },
    findToken(email) { //faz o select no banco para retornar o token do usuário que pede redefinição de senha
      return new Promise(function(resolve){
        pool.query('select B.token from ' +
       'public.users A ' +
        'INNER JOIN public.user_tokens B ' +
        'ON A.id = B.user_id ' +
        'where A.email = $1' + 
        'ORDER BY B.created_At', [email], function(error, result){
          if (error) {
            throw error
          }
          resolve({ token: result.rows[0].token })
        })
      })
    }
  })

}

