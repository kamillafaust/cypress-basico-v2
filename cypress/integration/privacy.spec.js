///<reference types="Cypress"/>:

it.only("testing the privacy policy page independently", () => {
  cy.visit("./src/privacy.html");
  cy.contains("CAC TAT - Política de privacidade").should("be.visible");
  cy.contains("Talking About Testing").should("be.visible");
});
