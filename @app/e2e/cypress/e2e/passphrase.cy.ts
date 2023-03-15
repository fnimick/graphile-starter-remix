/// <reference types="Cypress" />

context("Passphrase", () => {
  beforeEach(() => {
    cy.clearTestUsers();
  });

  it("can navigate to passphrase page on desktop", () => {
    cy.viewport("macbook-13");
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");
    cy.getCy("settingslayout-link-passphrase").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings/security");
  });

  it("can navigate to passphrase page on mobile/tablet", () => {
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");

    // Toggle drawer
    cy.getCy("settingslayout-drawer-toggle").click();
    cy.getCy("settingslayout-link-passphrase").filter(":visible").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings/security");
  });

  it("can can change the user's password, log out, and back in", () => {
    const PASSWORD = "MyPassword1";
    const NEW_PASSWORD = "MyPassword2!";

    // Setup
    cy.login({
      next: "/settings/security",
      verified: true,
      username: "testuser",
      name: "Test User",
      password: PASSWORD,
    });

    cy.getCy("securitypage-button-submit").click();
    cy.contains("Please input your passphrase").should("exist");

    cy.getCy("securitypage-input-oldpassword").type("wrong");
    cy.getCy("securitypage-input-password1").type(NEW_PASSWORD);
    cy.getCy("securitypage-input-password2").type(NEW_PASSWORD);
    cy.getCy("securitypage-button-submit").click();
    cy.contains("Incorrect old passphrase").should("exist");

    cy.getCy("securitypage-input-oldpassword").clear();
    cy.getCy("securitypage-input-oldpassword").type(PASSWORD);
    cy.getCy("securitypage-button-submit").click();
    cy.contains("Passphrase changed").should("exist");

    // Log out
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-button-logout").click({ force: true }); // pointer events don't reliably update in e2e

    cy.url().should("equal", Cypress.env("WEB_URL") + "/");

    // Log back in
    cy.getCy("layout-link-login").click();
    cy.getCy("loginpage-button-withusername").click();

    cy.getCy("loginpage-input-username").type("testuser");
    cy.getCy("loginpage-input-password").type(NEW_PASSWORD);
    cy.getCy("loginpage-button-submit").click();

    cy.url().should("equal", Cypress.env("WEB_URL") + "/"); // Should be on homepage
    cy.getCy("layout-link-login").should("not.exist"); // Should be logged in
    cy.getCy("layout-dropdown-user").should("contain", "TU"); // Should be logged in
  });
});
