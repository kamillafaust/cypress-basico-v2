///<reference types="Cypress"/>:

describe("Customer Support Center TAT", () => {
  const THREE_SECONDS = 3000;
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  it("checks the application title", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("fills in the mandatory fields and submits the form", () => {
    const longText = Cypress._.repeat("abcdefghijklm", 14);
    cy.clock();
    cy.get("#firstName").should("be.visible").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS);
    cy.get(".success").should("not.be.visible");
  });

  it("displays an error message when submitting the form with an invalidly formatted email", () => {
    cy.clock();
    cy.get("#firstName").should("be.visible").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail");
    cy.get("#open-text-area").type("Teste");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS);
    cy.get(".error").should("not.be.visible");
  });

  Cypress._.times(4, () => {
    it("phone field remains empty when filled with non-numeric values", () => {
      cy.get("#phone").type("abcdfeghijklm").should("have.text", "");
    });
  });

  it("displays an error message when the phone becomes mandatory but is not filled in before form submission", () => {
    cy.clock();
    cy.get("#firstName").type("Kamilla");
    cy.get("#lastName").type("Faust");
    cy.get("#email").type("kamillafaust@gmail.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("New message");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS);
    cy.get(".error").should("not.be.visible");
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
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS);
    cy.get(".error").should("not.be.visible");
  });

  it("sends the form successfully using a custom command", () => {
    cy.clock();
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
    cy.tick(THREE_SECONDS);
    cy.get(".success").should("not.be.visible");
  });

  it("selects a product (YouTube) by  its text", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("selects a product (Mentoring) by  its value", () => {
    const mentoring = "mentoria";
    cy.get("#product").select(mentoring).should("have.value", mentoring);
  });

  it("selects a product (Blog) by  its index", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('mark the type of service as "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("mark each type of service", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("check all checkboxes and uncheck the last one", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("select a file from the fixtures folder", () => {
    cy.get('input[type="file"]#file-upload')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("selects a file simulating a drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("selects a file using a fixture for which an alias has been given", () => {
    cy.fixture("example.json").as("exampleFile");
    cy.get('input[type="file"]')
      .selectFile("@exampleFile")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verify that the privacy policy opens in another tab without the need for a click", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("access the privacy policy page by removing the target attribute and then clicking on the link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("CAC TAT - Política de privacidade").should("be.visible");
  });

  it("show and hide success and error messages using .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso")
      .invoke("hide")
      .should("not.be.visible");

    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("Filling the text area using .invoke", () => {
    const longText = Cypress._.repeat("123456", 14);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("make an HTTP request", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should((response) => {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it.only("finding the hidden cat", () => {
    cy.get("#cat").invoke("show").should("be.visible");
    cy.get("#title").invoke("text", "CAT TAT");
    cy.get("#subtitle").invoke("text", "The cat was found");
  });
});
