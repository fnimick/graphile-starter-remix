/// <reference types="Cypress" />

const PASSWORD = "MyPassword1";

context("Login", () => {
  beforeEach(() => {
    cy.clearTestUsers();
  });

  it("can log in", () => {
    // Setup
    cy.serverCommand("createUser", {
      username: "testuser",
      name: "Test User",
      verified: true,
      password: PASSWORD,
    });
    cy.visit(Cypress.env("WEB_URL") + "/login");
    cy.getCy("loginpage-button-withusername").click();
    cy.getCy("layout-link-login").should("not.exist"); // No login button on login page

    // Action
    cy.getCy("loginpage-input-username").type("testuser");
    cy.getCy("loginpage-input-password").type(PASSWORD);
    cy.getCy("loginpage-button-submit").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/"); // Should be on homepage
    cy.getCy("layout-link-login").should("not.exist"); // Should be logged in
    cy.getCy("layout-dropdown-user").should("contain", "TU"); // Should be logged in
  });

  it("fails on bad password", () => {
    // Setup
    cy.serverCommand("createUser", {
      username: "testuser",
      name: "Test User",
      verified: true,
      password: PASSWORD,
    });
    cy.visit(Cypress.env("WEB_URL") + "/login");
    cy.getCy("loginpage-button-withusername").click();

    // Action

    cy.getCy("loginpage-input-username").type("testuser");
    cy.getCy("loginpage-input-password").type(PASSWORD + "!");
    cy.getCy("loginpage-button-submit").click();

    // Assertion
    cy.contains("Incorrect username or passphrase").should("exist");
    cy.url().should("include", Cypress.env("WEB_URL") + "/login/email"); // Should be on login page still
    cy.getCy("layout-link-login").should("not.exist"); // No login button on login page
    cy.getCy("layout-dropdown-user").should("not.exist"); // Should not be logged in
    cy.getCy("layout-dropdown-user").should("not.exist"); // Should not be logged in

    // But can recover
    cy.getCy("loginpage-input-password").type("{backspace}"); // Delete the '!' that shouldn't be there
    cy.getCy("loginpage-button-submit").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/"); // Should be on homepage
    cy.getCy("layout-link-login").should("not.exist"); // Should be logged in
    cy.getCy("layout-dropdown-user").should("contain", "TU"); // Should be logged in
  });
});
