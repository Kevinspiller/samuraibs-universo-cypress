import loginPage from '../support/pages/login'
import dashPage from '../support/pages/dash'

describe('dashboard', function(){

    context('quando o cliente faz o agendamento no app mobile', function(){

        const data = {
            customer: { // cliente (API)
                name: 'Nikki Six',
                email: 'sixx@motleycrue.com',
                password: 'pwd123',
                is_provider: false
            },
            provider: { // barbeiro que realiza o serviço
                name: 'Ramon Valdes',
                email: 'ramon@televisa.com',
                password: 'pwd123',
                is_provider: true
            },
            appointmentHour: '14:00'
        }

        before(function(){
            cy.postUser(data.provider)// cadastra o provider (barbeiro) diretamente pela api
            cy.postUser(data.customer)// cadastra o cliente diretamente pela api
           
            cy.apiLogin(data.customer)// chamada para fazer login do cliente pela api
            cy.setProviderId(data.provider.email)// chamada para buscar (GET) o id do provider (barbeiro)
            cy.createAppointment(data.appointmentHour) //cadastro do agendamento
        })
    
        it('o mesmo deve ser exibido no dashboard',function(){
           
            loginPage.go() // acessa página
            loginPage.form(data.provider) // preenche os campos com o provider
            loginPage.submit() // clica no botão acessar

            dashPage.calendarShouldBeVisible() //valida se o calendário está visível
            
            const day = Cypress.env('appointmentDay') // pega a data do agendamento dinâmica
            dashPage.selectDay(day) //seleciona o dia

            dashPage.appointmentShouldBe(data.customer, data.appointmentHour) //valida se o dia + horário escolhidos estão visíveis

        })
    })
})