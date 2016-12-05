(function() {
  'use strict';

  $('.button-collapse').sideNav();
  $('select').material_select();

  const clearSearch = function() {
    $('input[type=text], textarea').val('');
  };

  const renderEvents = function(state) {
    const shows = state;
    for (const show of shows) {
      const ticketStatus = `Tickets are ${show.ticket_status}.`;
      const collectionDiv = $('<ul>')
        .prop('class', 'collection with-header');
      const liHeader = $('<li>').prop('class', 'collection-header');
      const showTitle = $('<h4>');
      const showDateContainer = $('<li>').prop('class', 'collection-item');
      const showDirectionsContainer = $('<a>')
        .prop('class', 'collection-item')
        .prop('href', `http://maps.google.com/maps?q=${show.venue.latitude},${show.venue.longitude}`)
        .text('Directions to Venue');
      let ticketsAvailableContainer;

      show.ticket_url === null
      ? ticketsAvailableContainer = $('<li>').prop('href',
          show.ticket_url).prop('class',
          'collection-item').text(ticketStatus)
      : ticketsAvailableContainer = $('<a>').prop('href',
          show.ticket_url).prop('class',
          'collection-item').text('Buy Tickets');
      liHeader.append(showTitle);
      showDateContainer.text(show.formatted_datetime);
      showTitle.text(show.title);
      collectionDiv.append(liHeader)
      .append(showDateContainer)
      .append(ticketsAvailableContainer)
      .append(showDirectionsContainer);
      $('.results').append(collectionDiv);
    }
  };

  const getEvents = function(input) {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        renderEvents(state);
      },
      dataType: 'jsonp'
    });
  };

  const createProfile = function(state) {
    console.log(state);
    const fbPage = $('<a>').prop('href', state.facebook_page_url);
    const fbTour = $('<a>').prop('href',
        state.facebook_tour_dates_url).text('Facebook Tour Page');
    const rowDiv = $('<div>').prop('class', 'row');
    const colDiv = $('<div>').prop('class', 'col s12 m6 l6');
    const cardDiv = $('<div>').prop('class', 'card');
    const cardImageDiv = $('<div>').prop('class', 'card-image');
    const profileImg = $('<img>').prop('src', state.thumb_url);
    const cardTitle = $('<span>').prop('class', 'card-title').text(state.name);
    const cardContent = $('<div>').prop('class', 'card-content');
    const linkDiv = $('<div>').prop('class', 'card-action');
    const cardLink = $('<a>')
      .prop('href', state.facebook_page_url).text('Facebook Page');
    const howManyEvents = $('<p>').text(`${state.name} Upcoming Events: ${state.upcoming_event_count}`);

    rowDiv.append(colDiv);
    colDiv.append(cardDiv);
    cardDiv.append(cardImageDiv).append(cardContent).append(linkDiv);
    cardImageDiv.append(profileImg)
      .append(cardTitle);
    cardContent.append(howManyEvents);
    linkDiv.append(cardLink).append(fbTour);
    fbPage.text('Facebook Page');
    $('.results')
    .append(rowDiv);
  };

  const getArtists = function(input) {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        if (!state.name) {
          Materialize.toast('Sorry, no match found.', 4000);
        }
        else {
          createProfile(state);
        }
      },
      dataType: 'jsonp'
    });
    getEvents(input);
  };

  $('#search').on('focus', () => {
    clearSearch();
  });

  $('#search').keyup((event) => {
    const code = event.which;
    const input = $('input').val();

    if (code === 13) {
      clearSearch();
      if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
        Materialize.toast('Please Enter an Artist or Group', 4000);

        return;
      }
      $('.results').empty();
      getArtists(input);
    }
  });

  $('.search-button').click(() => {
    const input = $('input').val();

    clearSearch();
    if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    $('.results').empty();
    getArtists(input);
  });
})();
