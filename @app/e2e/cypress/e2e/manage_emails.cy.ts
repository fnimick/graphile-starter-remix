/// <reference types="Cypress" />

context("Manage emails", () => {
  beforeEach(() => {
    // Wait 100ms for previous page loads to finish. Otherwise, the attachment
    // of a subscription controller on login can occur right as a test user is
    // being cleared, causing a client error.
    cy.wait(100);
    cy.serverCommand("clearTestUsers");
  });

  it("can navigate to manage emails page", () => {
    // Disable ResizeObserver errors
    Cypress.on(
      "uncaught:exception",
      (err: any) =>
        !err.message.includes("ResizeObserver loop limit exceeded") as
          | false
          | void
    );
  });

  it("can navigate to manage emails page on desktop", () => {
    cy.viewport("macbook-13");
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");
    cy.getCy("settingslayout-link-emails").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings/emails");
  });

  it("can navigate to manage emails page on mobile/tablet", () => {
    // Setup
    cy.login({ next: "/", verified: true });

    // Action
    cy.getCy("layout-dropdown-user").click();
    cy.getCy("layout-link-settings").click();
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings");

    // Toggle drawer
    cy.getCy("settingslayout-drawer-toggle").click();

    cy.getCy("settingslayout-link-emails").filter(":visible").click();

    // Assertion
    cy.url().should("equal", Cypress.env("WEB_URL") + "/settings/emails");
  });

  it("can add an email, verify it, make it primary, and delete original email", () => {
    const email = "newemail@example.com";
    // Setup
    cy.login({ next: "/settings/emails", verified: true });
    cy.contains("testuser@example.com").should("exist");
    cy.contains("(unverified)").should("not.exist");

    // Action: add email
    cy.getCy("settingsemails-button-addemail").click();
    cy.getCy("settingsemails-input-email").type(email);
    cy.getCy("settingsemails-button-submit").click();

    // Assertion
    cy.getCy("settingsemails-emailitem-newemail-example-com").within(() => {
      cy.root().should("exist");
      cy.contains("newemail@example.com").should("exist");
      cy.contains("(unverified)").should("exist");
    });

    // Action: verify the email
    cy.serverCommand("getEmailSecrets", { email }).then((secrets) => {
      const { user_email_id, verification_token } = secrets;
      const url = `${Cypress.env("WEB_URL")}/verify?id=${encodeURIComponent(
        user_email_id
      )}&token=${encodeURIComponent(verification_token!)}`;
      cy.visit(url);
      cy.contains("Email Verified").should("exist");
      cy.visit(Cypress.env("WEB_URL") + "/settings/emails");
    });

    // Assertion
    cy.getCy("settingsemails-emailitem-testuser-example-com").within(() => {
      cy.root().should("exist");
      cy.getCy("settingsemails-indicator-primary").should("exist");
      cy.getCy("settingsemails-button-makeprimary").should("not.exist");
    });
    cy.getCy("settingsemails-emailitem-newemail-example-com").within(() => {
      cy.root().should("exist");
      cy.contains("newemail@example.com").should("exist");
      cy.contains("(unverified)").should("not.exist");
      cy.getCy("settingsemails-button-makeprimary").should("exist");
    });

    // Action: make new email primary
    cy.getCy("settingsemails-button-makeprimary").click();

    // Assertions
    cy.getCy("settingsemails-emailitem-testuser-example-com").within(() => {
      cy.root().should("exist");
      cy.getCy("settingsemails-indicator-primary").should("not.exist");
      cy.getCy("settingsemails-button-makeprimary").should("exist");
    });
    cy.getCy("settingsemails-emailitem-newemail-example-com").within(() => {
      cy.root().should("exist");
      cy.getCy("settingsemails-indicator-primary").should("exist");
      cy.getCy("settingsemails-button-makeprimary").should("not.exist");
    });

    // Action: delete old email
    cy.getCy("settingsemails-emailitem-testuser-example-com").within(() => {
      cy.getCy("settingsemails-button-delete").click();
    });

    // Assertions
    cy.getCy("settingsemails-emailitem-testuser-example-com").should(
      "not.exist"
    );
  });
});
