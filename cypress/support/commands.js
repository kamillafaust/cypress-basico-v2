Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.get("#firstName").should("be.visible").type("Kamilla");
  cy.get("#lastName").type("Faust");
  cy.get("#email").type("kamillafaust@gmail.com");
  cy.get("#open-text-area").type("New message");
  cy.contains("button", "Enviar").click();
});
