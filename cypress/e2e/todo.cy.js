// Random event data arrays
const eventTitles = [
  'Tech Conference 2024',
  'Summer Music Festival',
  'Business Networking Meetup',
  'Art Exhibition Opening',
  'Sports Championship',
  'Food & Wine Tasting',
  'Startup Pitch Competition',
  'Community Workshop',
  'Science Fair',
  'Film Premiere Night',
  'Book Launch Party',
  'Fitness Challenge',
  'Cooking Masterclass',
  'Photography Workshop',
  'Dance Performance',
  'Comedy Night',
  'Gaming Tournament',
  'Environmental Summit',
  'Health & Wellness Expo',
  'Educational Seminar'
];

const eventDescriptions = [
  'Join us for an exciting event filled with innovation and networking opportunities.',
  'Experience the best of local talent and international performances.',
  'Connect with industry leaders and expand your professional network.',
  'Discover amazing artworks from emerging and established artists.',
  'Witness thrilling competitions and celebrate athletic excellence.',
  'Savor exquisite flavors and learn from culinary experts.',
  'Watch innovative startups present their groundbreaking ideas.',
  'Learn new skills and connect with like-minded individuals.',
  'Explore fascinating scientific discoveries and experiments.',
  'Be among the first to see this highly anticipated new release.',
  'Celebrate the launch of an inspiring new book with the author.',
  'Push your limits and achieve your fitness goals with others.',
  'Master new cooking techniques from professional chefs.',
  'Capture stunning moments with expert photography guidance.',
  'Enjoy an evening of beautiful choreography and music.',
  'Laugh the night away with top comedians and entertainers.',
  'Compete with gamers from around the world for amazing prizes.',
  'Discuss solutions for environmental challenges and sustainability.',
  'Discover the latest trends in health, wellness, and lifestyle.',
  'Gain valuable insights from industry experts and thought leaders.'
];

const eventLocations = [
  'Downtown Convention Center',
  'Central Park Amphitheater',
  'Tech Hub Innovation Center',
  'Modern Art Gallery',
  'Sports Complex Arena',
  'Gourmet Restaurant District',
  'Startup Incubator Space',
  'Community Center Hall',
  'Science Museum Auditorium',
  'Cinema Multiplex',
  'Independent Bookstore',
  'Fitness Center Studio',
  'Culinary Institute Kitchen',
  'Photography Studio',
  'Performing Arts Theater',
  'Comedy Club Venue',
  'Gaming Center',
  'Environmental Center',
  'Wellness Spa Resort',
  'University Lecture Hall'
];

// Helper function to get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Helper function to generate random event data
const generateRandomEventData = () => {
  return {
    title: getRandomItem(eventTitles),
    description: getRandomItem(eventDescriptions),
    location: getRandomItem(eventLocations)
  };
};

beforeEach(() => {
  const url = Cypress.env("FRONTEND_URL");
  cy.visit(url);
  // Clear localStorage to ensure we start with default theme
  cy.clearLocalStorage();
  cy.reload();
  cy.wait(1000);
});

describe("Started", () => {
  it("connects", () => {
    cy.contains(/Events Dashboard/i).should("be.visible");
  });
});


describe("Theme Toggle", () => {
  it("should display theme toggle button", () => {
    cy.get("[data-test='theme-toggle-button']").should("be.visible");
    cy.get("[data-test='theme-toggle-button']").should("have.attr", "aria-label");
  });

  it("should start with light theme by default", () => {
    // Check initial theme state
    cy.get("html").should("not.have.class", "dark");
    cy.get("[data-test='theme-toggle-button']").should("contain", "🌙");
    cy.get("[data-test='theme-toggle-button']").should("have.attr", "aria-label", "Switch to dark mode");
  });

  it("should toggle to dark theme when clicked", () => {
    // Click theme toggle button
    cy.get("[data-test='theme-toggle-button']").click();
    
    // Verify dark theme is applied
    cy.get("html").should("have.class", "dark");
    cy.get("[data-test='theme-toggle-button']").should("contain", "☀️");
    cy.get("[data-test='theme-toggle-button']").should("have.attr", "aria-label", "Switch to light mode");
  });

  it("should toggle back to light theme", () => {
    // First switch to dark theme
    cy.get("[data-test='theme-toggle-button']").click();
    cy.get("html").should("have.class", "dark");
    
    // Then switch back to light theme
    cy.get("[data-test='theme-toggle-button']").click();
    cy.get("html").should("not.have.class", "dark");
    cy.get("[data-test='theme-toggle-button']").should("contain", "🌙");
    cy.get("[data-test='theme-toggle-button']").should("have.attr", "aria-label", "Switch to dark mode");
  });

  it("should persist theme preference in localStorage", () => {
    // Switch to dark theme
    cy.get("[data-test='theme-toggle-button']").click();
    
    // Check localStorage
    cy.window().its("localStorage").invoke("getItem", "theme").should("eq", "dark");
    
    // Switch back to light theme
    cy.get("[data-test='theme-toggle-button']").click();
    cy.window().its("localStorage").invoke("getItem", "theme").should("eq", "light");
  });

  it("should maintain theme after page reload", () => {
    // Switch to dark theme
    cy.get("[data-test='theme-toggle-button']").click();
    cy.get("html").should("have.class", "dark");
    
    // Reload page
    cy.reload();
    
    // Verify dark theme is still applied
    cy.get("html").should("have.class", "dark");
    cy.get("[data-test='theme-toggle-button']").should("contain", "☀️");
    cy.get("[data-test='theme-toggle-button']").should("have.attr", "aria-label", "Switch to light mode");
  });

  it("should apply theme styles correctly", () => {
    // Test light theme styles
    cy.get("body").should("have.css", "background-color", "rgb(255, 255, 255)");
    
    // Switch to dark theme
    cy.get("[data-test='theme-toggle-button']").click();
    
    // Test dark theme styles (background should be dark)
    cy.get("body").should("have.css", "background-color", "rgb(17, 24, 39)");
    
    // Verify navbar has dark theme styling
    cy.get(".navbar").should("exist");
  });

  it("should have proper button styling and interactions", () => {
    const button = cy.get("[data-test='theme-toggle-button']");
    
    // Check button styling
    button.should("have.css", "cursor", "pointer");
    button.should("have.css", "border-radius", "8px");
    
    // Test hover state (simulate hover)
    button.trigger("mouseover");
    button.should("be.visible");
    
    // Test button is clickable
    button.should("not.be.disabled");
  });
});

describe("Create Event Button", () => {
  it("should display create event button", () => {
    cy.get("[data-test='create-event-button']").should("be.visible");
  });

  it("should open and close create event modal when clicked", () => {
    cy.get("[data-test='modal-title']").should("not.exist");
    cy.get("[data-test='create-event-button']").click();
    cy.get("[data-test='modal-title']").should("be.visible");
    cy.get('.modal-overlay').click('right');
    cy.get("[data-test='modal-title']").should("not.exist");
  });

  it("should fill in the form and submit", () => {
    cy.get("[data-test='loading-text']").should("not.exist");
    cy.get('.stat-card--total > .stat-card__value').invoke('text').then((text) => {
      const before = Number(text);
      cy.get("[data-test='create-event-button']").click();
      cy.get("[data-test='modal-title']").should("be.visible");
      // try click save button without filling in the form
      // when click nothing should happen
      cy.get("[data-test='save-button']").click();
      cy.get("[data-test='modal-title']").should("exist");
      cy.get("[data-test='title-input']").type(getRandomItem(eventTitles));
      cy.get("[data-test='save-button']").click();
      cy.get("[data-test='modal-title']").should("exist");
      cy.get("[data-test='description-input']").type(getRandomItem(eventDescriptions));
      cy.get("[data-test='save-button']").click();
      cy.get("[data-test='modal-title']").should("exist");
      cy.get("[data-test='location-input']").type(getRandomItem(eventLocations));
      cy.get(':nth-child(1) > .date-picker-container > .react-datepicker-wrapper > .react-datepicker__input-container > .date-picker').type("2025-01-01");
      cy.get(':nth-child(2) > .date-picker-container > .react-datepicker-wrapper > .react-datepicker__input-container > .date-picker').type("2025-01-02");
      cy.get("[data-test='complete-checkbox']").check();
      cy.get("[data-test='complete-checkbox']").uncheck();
      cy.get("[data-test='save-button']").click();
      cy.get("[data-test='toast']").should("be.visible");
      cy.get("[data-test='toast']").should("contain", "Event created successfully");
      cy.get("[data-test='toast']").should("have.class", "toast-success");
      cy.wait(4000);
      cy.get("[data-test='toast']").should("not.exist");
      cy.get('.stat-card--total > .stat-card__value').invoke('text').then((newText) => {
        const after = Number(newText);
        expect(after).to.equal(before + 1);
      });
    });
  });
});

describe("Event List", () => {
  it("should display event list", () => {
    cy.get("[data-test^='event-accordion-']").should("be.visible");
    cy.get("[data-test='event-description-title']").should("not.exist");
    cy.get("[data-test^='event-accordion-']").first().click();
    cy.get("[data-test='event-description-title']").should("be.visible");
    cy.get("[data-test^='event-accordion-']").first().click();
    cy.get("[data-test='event-description-title']").should("not.exist");
  });

  it("should display event list stats", () => {
    cy.get('.stat-card--completed > .stat-card__value')
      .invoke('text')
      .then((completedText) => {
        const beforeCompleted = Number(completedText);
  
        cy.get('.stat-card--pending > .stat-card__value')
          .invoke('text')
          .then((pendingText) => {
            const beforePending = Number(pendingText);
  
            cy.get('[data-test^="event-accordion-"]') // selects all that start with event-accordion-
              .first() // pick the first one or loop through
              .within(() => {
                cy.get('.complete-checkbox').click();
              });

            cy.get('.stat-card--completed > .stat-card__value')
              .invoke('text')
              .then((completedAfterText) => {
                const afterCompleted = Number(completedAfterText);
                expect(afterCompleted).to.equal(beforeCompleted + 1);
              });
  
            cy.get('.stat-card--pending > .stat-card__value')
              .invoke('text')
              .then((pendingAfterText) => {
                const afterPending = Number(pendingAfterText);
                expect(afterPending).to.equal(beforePending - 1);
              });

              cy.get('[data-test^="event-accordion-"]') // selects all that start with event-accordion-
              .first() // pick the first one or loop through
              .within(() => {
                cy.get('.complete-checkbox').click();
              });

          });
      });
  });

  it("should edit event", () => {
    cy.get("[data-test^='event-accordion-']").first().click();
    cy.get("[data-test='event-description-title']").should("be.visible");
    cy.get("[data-test='modal-title']").should("not.exist");
    cy.get('[data-test^="event-accordion-"] > .event-actions > .edit-button')
      .first()
      .click();
    cy.get("[data-test='modal-title']").should("be.visible");
    const newTitle = "Edited: "+getRandomItem(eventTitles);
    cy.get("[data-test='title-input']").clear().type(newTitle);
    cy.get("[data-test='save-button']").click();
    cy.get("[data-test='modal-title']").should("not.exist");
    cy.get("[data-test='event-description-title']").should("be.visible");
    cy.contains(newTitle).should("be.visible");
  });

  it("should delete event", () => {
    cy.get('.stat-card--total > .stat-card__value').invoke('text').then((text) => {
      const before = Number(text);
      let firstTitle = "";
      cy.get('[data-test^="event-accordion-"]')
        .first()
        .find('.event-title-section .event-title')
        .invoke('text')
        .then(title => {
          firstTitle = title.trim();

          cy.contains(firstTitle).should("be.visible");
          cy.get('.modal-header > h2').should("not.exist");
          cy.get('[data-test^="event-accordion-"] > .event-actions > .delete-button')
            .first()
            .click();
          cy.get('.modal-header > h2').should("be.visible");
          cy.get('.delete-confirm-button').click();
          cy.get("[data-test='toast']").should("be.visible");
          cy.get("[data-test='toast']").should("contain", "Event deleted successfully");
          cy.wait(4000);
          cy.get("[data-test='toast']").should("not.exist");
          cy.contains(firstTitle).should("not.exist");
          cy.get('.stat-card--total > .stat-card__value').invoke('text').then((text) => {
            const after = Number(text);
            expect(after).to.equal(before - 1);
          });
        });
    });
  });

});


