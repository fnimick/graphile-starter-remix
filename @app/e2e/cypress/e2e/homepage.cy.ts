/// <reference types="Cypress" />

context("HomePage", () => {
  it("renders correctly", () => {
    // Setup
    cy.visit(Cypress.env("WEB_URL"));

    // Action

    // Assertions
    cy.url().should("equal", Cypress.env("WEB_URL") + "/");
    cy.getCy("header-login-button").should("exist");
    cy.getCy("homepage-header").should("exist");
  });
});
