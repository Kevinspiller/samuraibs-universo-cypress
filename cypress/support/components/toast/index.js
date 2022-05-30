import { el } from './elements' //componente toast

class Toast {
    shouldHaveText(expectText) { //valida texto da saída
        cy.get(el.toast)
            .should('be.visible')
            .should('have.css', 'opacity', '1')
            .find('p')
            .should('have.text', expectText)
    }
}

export default new Toast()