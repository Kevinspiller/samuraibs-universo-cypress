// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import moment from 'moment'
import { apiServer } from '../../cypress.json'
import loginPage from './pages/login'
import dashPage from './pages/dash'

// App Actions
Cypress.Commands.add('uiLogin', function(user){
    loginPage.go()
    loginPage.form(user)
    loginPage.submit()
    dashPage.header.userLoggedIn(user.name)
})

Cypress.Commands.add('postUser', function (user) {
    cy.task('removeUser', user.email) //chamando a task criada em plugins -> index.js e printando no console o resultado
        .then(function (result) {
            console.log(result)
        })

    cy.request({
        method: 'POST',
        url: apiServer + '/users',
        body: user
    }).then(function (response) {
        expect(response.status).to.eq(200)
    })
})

Cypress.Commands.add('recoveryPass', function (email) {
    cy.request({
        method:'POST',
        url: apiServer + '/password/forgot',
        body: { email: email }
    }).then(function (response) {
        expect(response.status).to.eq(204)

        cy.task('findToken', email)
            .then(function (result) {
                //console.log(result.token)
                Cypress.env('recoveryToken', result.token)
            })
    })

})

Cypress.Commands.add('createAppointment', function (hour) {

    let now = new Date()
    now.setDate(now.getDate() + 1) // varíavel now será sempre a data atual + 1, assim sempre sendo data futura

    Cypress.env('appointmentDay', now.getDate()) //variável de ambiente appointmentDay recebe apenas a data + 1
    
    const date = moment(now).format(`YYYY-MM-DD ${hour}:00`) //interpolação de string da data + h/m/s com formatação do moment para o formato americano 

    const payload = {
        provider_id: Cypress.env('providerId'),
        date: date
    }

    cy.request({
        method: 'POST',
        url: apiServer + '/appointments',
        body: payload, //como body manda email e senha do usuário
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken')
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
    })

})

Cypress.Commands.add('setProviderId', function (providerEmail) {

    cy.request({
        method: 'GET',
        url: apiServer + '/providers',
        headers: {
            authorization: 'Bearer ' + Cypress.env('apiToken') // manda no authorization o portador + o token
        }
    }).then(function (response) {
        expect(response.status).to.eq(200)
        console.log(response.body)

        const providerList = response.body // variável com a lista de providers

        providerList.forEach(function (provider) { // loop para percorrer a lista de providers
            if (provider.email === providerEmail) { // somente vamos obter o id do prestador de serviço da lista cujo email for igual ao email que recebe como argumento ao invocar o comando setProviderId
                Cypress.env('providerId', provider.id)// neste caso o Ramon Valdes
            }
        })
    })
})

Cypress.Commands.add('apiLogin', function (user) {

    const payload = {
        email: user.email,
        password: user.password
    }

    cy.request({
        method: 'POST',
        url: apiServer +'/sessions',
        body: payload //como body manda email e senha do usuário
    }).then(function (response) {
        expect(response.status).to.eq(200)
        Cypress.env('apiToken', response.body.token) //armazena o token na varíavel env chamada apiToken
    })

})