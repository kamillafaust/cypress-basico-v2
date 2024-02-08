///<reference types="Cypress"/>:

describe("Customer Support Center TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  it("checks the application title", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("fills in the mandatory fields and submits the form", () => {
    const longText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed consequat purus nec nulla posuere, sit amet vestibulum velit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin tincidunt velit in arcu aliquam, ac dignissim ante cursus. Fusce hendrerit purus quis semper congue.";
    cy.get("#firstName").should("be.visible").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
  });

  it("displays an error message when submitting the form with an invalidly formatted email", () => {
    cy.get("#firstName").should("be.visible").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail");
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("phone field remains empty when filled with non-numeric values", () => {
    cy.get("#phone").type("abcdfeghijklm").should("have.text", "");
  });

  it("displays an error message when the phone becomes mandatory but is not filled in before form submission", () => {
    cy.get("#firstName").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("New message");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("fills and clears the fields name, last name, email, and phone", () => {
    cy.get("#firstName")
      .type("Kamilla")
      .should("have.value", "Kamilla")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Faust")
      .should("have.value", "Faust")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("kamillafaust@gmail")
      .should("have.value", "kamillafaust@gmail")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("48988337337")
      .should("have.value", "48988337337")
      .clear()
      .should("have.value", "");
  });

  it("displays an error message when submitting the form without filling in the mandatory fields", () => {
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("sends the form successfully using a custom command", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
  });
});
