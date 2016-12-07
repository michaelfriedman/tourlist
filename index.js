(function() {
  'use strict';
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'left', // Choose the horizontal origin
    closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
    draggable: true // Choose whether you can drag to open on touch screens
  }
  );
  $('select').material_select();

  const clearSearch = function() {
    $('#search-input[type=text], textarea').val('');
  };

  const renderEvents = function(state) {
    const shows = state;

    for (const show of shows) {
      const collectionDiv = $('<ul>')
        .prop('class', 'collection with-header center');
      const liHeader = $('<li>').prop('class', 'collection-header');
      const showTitle = $('<h4>');
      const showDateContainer = $('<li>').prop('class', 'collection-item');
      const showDirectionsContainer = $('<a>')
        .prop({ class: 'collection-item', href: `http://maps.google.com/maps?q=${show.venue.latitude},${show.venue.longitude}`, text: 'Directions to Venue' });
      let ticketsAvailableContainer;

      show.ticket_url === null
      ? ticketsAvailableContainer = $('<li>')
        .prop({
          // href: show.ticket_url,
          class: 'collection-item',
          // text: `Tickets are ${show.ticket_status}.`
        }).text(`Tickets are ${show.ticket_status}.`)
      : ticketsAvailableContainer = $('<a>')
        .prop({
          href: show.ticket_url,
          class: 'collection-item',
          text: 'Buy Tickets'
        });
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
    const fbPage = $('<a>')
      .prop('href', state.facebook_page_url)
      .text('Facebook')
      .css('display', 'block');
    const tourPage = $('<a>')
      .prop('href', state.facebook_tour_dates_url)
      .text('Tour Page')
      .css('display', 'block');
    const cardTitle = $('<h4>').prop('class', 'center').text(state.name);
    const cardLink = $('<a>')
      .prop('href', state.facebook_page_url).text('Facebook Page');
    const howManyEvents = $('<p>')
      .text(`${state.name} Upcoming Events: ${state.upcoming_event_count}`);
    const responsiveImg = $('<img>')
      .prop({ class: 'responsive-img left', src: state.thumb_url })
      .css('border', '1px solid black');

    $('.artistName').append(cardTitle).css('display', 'block');
    $('.profileDiv').css('display', 'inline-block')
        .append(responsiveImg);
    $('.detailsDiv').css('display', 'inline-block')
      .append(tourPage)
      .append(fbPage)
      .append(howManyEvents);
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

  $('#search-input').on('focus', () => {
    clearSearch();
  });

  const advancedSearch = function(input) {
    const city = $('#city').val();
    const region = $('#state').val();
    const radius = $('#radius').val();

    if (input.trim() === '' || input.trim() === 'Artist or Group Name') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    if (city.trim() === '') {
      Materialize.toast('Please Enter Your City', 4000);

      return;
    }
    if (region === null) {
      Materialize.toast('Please Select Your State', 4000);

      return;
    }
    if (radius === null) {
      Materialize.toast('Please Select How Far You Will Travel', 4000);

      return;
    }
    $('.results').empty();
    $('.artistName, .profileDiv, .detailsDiv').empty();

    clearSearch();
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
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events/search.json?api_version=2.0&app_id=michaelfriedman&location=${city},${region}&radius=${radius}`,
      success: (state) => {
        renderEvents(state);
      },
      dataType: 'jsonp'
    });
  };

  $('#search-input').keyup((event) => {
    const code = event.which;
    const input = $('#search-input').val();

    if (code === 13) {
      if ($('input:checkbox').is(':checked')) {
        advancedSearch(input);
      }
      else {
        $('.results').empty();
        $('.artistName, .profileDiv, .detailsDiv').empty();

        getArtists(input);
      }
    }
  });

  $('.search-button').click(() => {
    const input = $('#search-input').val();

    if (input.trim() === '' || input.trim() === 'Enter Your Search Here') {
      Materialize.toast('Please Enter an Artist or Group', 4000);

      return;
    }
    $('.results').empty();
    $('.artistName, .profileDiv, .detailsDiv').empty();
    clearSearch();
    getArtists(input);
  });

  $('#advanced-button').click(() => {
    const input = $('#search-input').val();

    advancedSearch(input);
  });

  $('input:checkbox').change(function() {
    if ($(this).is(':checked')) {
      $('#advanced').removeClass('hide');
      $('#advanced-button').removeClass('hide');
      $('#search-button').hide();
    }
    else {
      $('#search-button').show();
      $('#advanced').addClass('hide');
      $('#advanced-button').addClass('hide');
    }
  });
})();
