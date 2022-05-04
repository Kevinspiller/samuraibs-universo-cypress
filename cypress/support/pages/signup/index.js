import { el } from './elements'

import toast from '../../components/toast'

class SignupPage { //steps encapsulados

    constructor() {
        this.toast = toast
    }

    go() { //visita a página
        cy.visit('/signup')
    }

    form(user) {// preenche o formulário
        cy.get(el.name).type(user.name)
        cy.get(el.email).type(user.email)
        cy.get(el.password).type(user.password)
    }

    submit() { //clica em cadastrar formulário
        cy.contains(el.signupButton).click()
    }

    alertHaveText(expectedText) {
        cy.contains('.alert-error', expectedText)
            .should('be.visible')
    }
}

export default new SignupPage()