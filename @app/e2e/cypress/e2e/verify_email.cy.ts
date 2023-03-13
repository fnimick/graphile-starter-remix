/// <reference types="Cypress" />

context("Verify email", () => {
  beforeEach(() => {
    // Wait 500ms for previous page loads to finish. Otherwise, the attachment
    // of a subscription controller on login can occur right as a test user is
    // being cleared, causing a client error.
    cy.wait(500);
    cy.serverCommand("clearTestUsers");
  });

  it("can open verification link", () => {
    // Setup
    cy.serverCommand("createUser", {
      username: "testuser",
    }).as("createUserResult");

    // Action
    cy.get("@createUserResult").then(
      ({ userEmailId, verificationToken }: any) => {
        const url = `${Cypress.env("WEB_URL")}/verify?id=${encodeURIComponent(
          String(userEmailId)
        )}&token=${encodeURIComponent(verificationToken)}`;
        cy.visit(url);
      }
    );

    // Assertion
    cy.contains("Email Verified").should("exist");
  });
});
