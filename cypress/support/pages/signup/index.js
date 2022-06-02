import { el } from './elements'

import toast from '../../components/toast'
import alert from '../../components/alert'

class SignupPage { //steps encapsulados

    constructor() {
        this.toast = toast
        this.alert = alert
    }

    go() { //visita a página
        cy.visit('/signup')

        cy.contains(el.title)
            .should('be.visible')
    }

    form(user) {// preenche o formulário
        cy.get(el.name).type(user.name)
        cy.get(el.email).type(user.email)
        cy.get(el.password).type(user.password)
    }

    submit() { //clica em cadastrar formulário
        cy.contains(el.signupButton).click()
    }
}

export default new SignupPage()