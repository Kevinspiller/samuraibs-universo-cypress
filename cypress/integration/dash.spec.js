
import dashPage from '../support/pages/dash'

import {customer, provider, appointment} from '../support/factories/dash' //importando dentro do teste os objetos que exporto na camada de fabricação (factories)

describe('dashboard', function(){

    context('quando o cliente faz o agendamento no app mobile', function(){

        before(function(){
            cy.postUser(provider)// cadastra o provider (barbeiro) diretamente pela api
            cy.postUser(customer)// cadastra o cliente diretamente pela api
           
            cy.apiLogin(customer)// chamada para fazer login do cliente pela api
            cy.setProviderId(provider.email)// chamada para buscar (GET) o id do provider (barbeiro)
            cy.createAppointment(appointment.hour) //cadastro do agendamento
        })
    
        it('o mesmo deve ser exibido no dashboard',function(){

            const day = Cypress.env('appointmentDay') // pega a data do agendamento dinâmica
           
            cy.uiLogin(provider)

            dashPage.calendarShouldBeVisible() //valida se o calendário está visível
            dashPage.selectDay(day) //seleciona o dia
            dashPage.appointmentShouldBe(customer, appointment.hour) //valida se o cliente e dia + horário escolhidos estão visíveis

        })
    })
})