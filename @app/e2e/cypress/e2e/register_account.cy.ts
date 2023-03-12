/// <reference types="Cypress" />

context("RegisterAccount", () => {
  beforeEach(() => {
    // Wait 100ms for previous page loads to finish. Otherwise, the attachment
    // of a subscription controller on login can occur right as a test user is
    // being cleared, causing a client error.
    cy.wait(100);
    cy.serverCommand("clearTestUsers");
  });

  it("can navigate to registration page", () => {
    // Setup
    cy.visit(Cypress.env("WEB_URL"));

    // Action
    cy.getCy("header-login-button").click();
    cy.getCy("loginpage-button-register").click();

    // Assertions
    cy.url().should("equal", Cypress.env("WEB_URL") + "/register?next=%2F");
    cy.getCy("registerpage-name-label").should("exist");
  });

  it("requires the form be filled", () => {
    // Setup
    cy.visit(Cypress.env("WEB_URL") + "/register");

    // Wait an extra 2000ms for the page to hydrate to guarantee that the form
    // handlers are attached.
    // cy.wait(2000);

    // Action
    cy.getCy("registerpage-submit-button").click();

    // Assertions
    cy.getCy("registerpage-name-label").should("exist");
    cy.contains("input your name");
    cy.contains("input your passphrase");
  });

  context("Account creation", () => {
    it("enables account creation", () => {
      // Setup
      cy.visit(Cypress.env("WEB_URL") + "/register");
      cy.getCy("header-login-button").should("not.exist"); // No login button on register page

      // Action
      cy.getCy("registerpage-input-name").type("Test User");
      cy.getCy("registerpage-input-username").type("testuser");
      cy.getCy("registerpage-input-email").type("test.user@example.com");
      cy.getCy("registerpage-input-password").type("Really Good Password");
      cy.getCy("registerpage-input-password2").type("Really Good Password");
      cy.getCy("registerpage-submit-button").click();

      // Assertions
      cy.url().should("equal", Cypress.env("WEB_URL") + "/"); // Should be on homepage
      cy.getCy("header-login-button").should("not.exist");
      cy.getCy("layout-dropdown-user").should("contain", "TU"); // Should be logged in
    });

    it("prevents creation if username is in use", () => {
      // Setup
      cy.serverCommand("createUser", { username: "testuser" });
      cy.visit(Cypress.env("WEB_URL") + "/register");

      // Action
      cy.getCy("registerpage-input-name").type("Test User");
      cy.getCy("registerpage-input-username").type("testuser");
      cy.getCy("registerpage-input-email").type("test.user@example.com");
      cy.getCy("registerpage-input-password").type("Really Good Password");
      cy.getCy("registerpage-input-password2").type("Really Good Password");
      cy.getCy("registerpage-submit-button").click();

      // Assertions
      cy.contains("account with this username").should("exist");
      cy.getCy("header-login-button").should("not.exist"); // No login button on register page
    });
  });
});
