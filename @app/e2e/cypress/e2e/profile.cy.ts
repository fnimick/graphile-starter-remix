/// <reference types="Cypress" />

context("Profile", () => {
  beforeEach(() => {
    cy.clearTestUsers();
  });

  it("can navigate to profile page on desktop", () => {
    cy.viewport("macbook-13");
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");
    cy.getCy("settingslayout-link-emails").click();
    cy.getCy("settingslayout-link-profile").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");
  });

  it("can navigate to profile page on mobile/tablet", () => {
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");

    // Toggle drawer
    cy.getCy("settingslayout-drawer-toggle").click();
    cy.getCy("settingslayout-link-emails").filter(":visible").click();

    cy.getCy("settingslayout-drawer-toggle").click();
    cy.getCy("settingslayout-link-profile").filter(":visible").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");
  });

  it("can can change the user's name and username, log out, and back in", () => {
    const PASSWORD = "MyPassword1";
    // Setup
    cy.login({
      next: "/settings",
      verified: true,
      username: "testuser",
      name: "Test User",
      password: PASSWORD,
    });

    cy.getCy("settingsprofile-input-name").should("have.value", "Test User");
    cy.getCy("settingsprofile-input-username").should("have.value", "testuser");

    cy.getCy("settingsprofile-input-name").clear();
    cy.getCy("settingsprofile-button-submit").click();
    cy.contains("Please input your name").should("exist");

    cy.getCy("settingsprofile-input-name").type("New User");
    cy.getCy("settingsprofile-input-username").clear();
    cy.getCy("settingsprofile-input-username").type("testusernew");
    cy.getCy("settingsprofile-button-submit").click();
    cy.contains("Please input your name").should("not.exist");
    cy.contains("Profile successfully updated").should("exist");

    // Form should not be cleared
    cy.getCy("settingsprofile-input-name").should("have.value", "New User");
    cy.getCy("settingsprofile-input-username").should(
      "have.value",
      "testusernew"
    );

    // Success message clears on type
    cy.getCy("settingsprofile-input-name").type("foo");
    cy.contains("Profile successfully updated").should("not.exist");

    cy.getCy("layout-dropdown-user").should("contain", "NU"); // New username should be reflected

    // Log out
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-button-logout").click({ force: true }); // pointer events don't reliably update in e2e

    cy.url().should("equal", Cypress.env("WEB_URL") + "/");

    // Log back in
    cy.getCy("layout-link-login").click();
    cy.getCy("loginpage-button-withusername").click();

    cy.getCy("loginpage-input-username").type("testusernew");
    cy.getCy("loginpage-input-password").type(PASSWORD);
    cy.getCy("loginpage-button-submit").click();

    cy.url().should("equal", Cypress.env("WEB_URL") + "/"); // Should be on homepage
    cy.getCy("layout-link-login").should("not.exist"); // Should be logged in
    cy.getCy("layout-dropdown-user").should("contain", "NU"); // Should be logged in
  });
});
