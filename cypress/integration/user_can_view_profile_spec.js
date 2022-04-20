describe.only("Viewing a profile", () => {
  
  xit("should displays the users details", () => {
    cy.signUp();
    cy.login();
    cy.visit("/profile")

    cy.get("#name-pronouns").should("contain", "Barry Barry-Barroldsson");
    cy.get("#name-pronouns").should("contain", "They/Them");

    cy.get(".friends-container").should("contain", "Your friends");

    cy.get(".about-container").should("contain", "About me")
  });

  xit("should display the users posts", () => {
    cy.signUp();
    cy.login();

    cy.addPost("MEHN stack!");
    cy.addPost("Testing is so fun!");
    cy.addPost("Baddiez don't test!");

    cy.visit("/profile");

    cy.get(".message").should("contain", "Baddiez don't test!");
    cy.get(".message").should("contain", "Testing is so fun!");
    cy.get(".message").should("contain", "MEHN stack!");
  });

  it("should have an add friend button unless profile owner", () => {
    cy.signUp();
    cy.login();

    cy.get("#dropdownUser1").click();
    cy.get("#dropdown-profile-link").click();
    cy.get("#add-friend-button").should("not.exist");

    cy.get("#dropdownUser1").click();
    cy.get("#sign-out-button").click();
    cy.signUp("Dick", "Dick-Dickinson", "dick@dong.com", "secured1ck");
    cy.login();

    cy.get("#searchBox").type("Dick Dick-Dickinson");
    cy.get("#searchButton").click();
    cy.get(".user-container").click();

    cy.get("#add-friend-button").should("exist");
  });

  it("should add a friend and list the friend on the users profile", () => {
    cy.signUp("Dick", "Dick-Dickinson", "dick@dong.com", "secured1ck");

    cy.signUp();
    cy.login();

    cy.get("#searchBox").type("Dick Dick-Dickinson");
    cy.get("#searchButton").click();
    cy.get(".user-container").click();

    cy.get("#add-friend-button").click();

    cy.get(".friend-name").should("contain", "Barry Barry-Barroldsson");

    cy.get("#dropdownUser1").click();
    cy.get("#dropdown-profile-link").click();

    cy.get(".friend-name").should("contain", "Dick Dick-Dickinson");
  })

});


