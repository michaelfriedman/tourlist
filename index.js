(function() {
  'use strict';

  const clearSearch = () => {
    $('input[type=text], textarea').val('');
  };

  const getEvents = (input) => {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        const events = state;
        const resultsDiv = $('.results');

        for (const event of events) {
          const showName = $('<h4>').text(event.title);
          const eventDateTime = $('<h5>').text(event.formatted_datetime);
          const ticketStatus = event.ticket_status;
          const ticketURL = event.ticket_url;
          const eventLong = event.venue.longitude;
          const eventLat = event.venue.latitude;
          const venueLink = $('<a>').prop('href',
            `http://maps.google.com/maps?q=${eventLat},${eventLong}`)
            .css('display', 'block').text('Get Directions to the Venue');
          // const eventID = event.id;
          const ticketLink = $('<a>').prop('href', ticketURL)
            .css('id', 'venue-link')
            .text(ticketStatus);

          resultsDiv
          .append(showName)
          .append(eventDateTime)
          .append(ticketLink)
          .append(venueLink)
          console.log(event);
        }
      },
      dataType: 'jsonp'
    });
  };

  const getArtists = (input) => {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        const h3 = $('<h3>').text(state.name);
        const resultsDiv = $('.results');
        const img = $('<img>').prop('src', state.thumb_url).css('class',
          'responsive-img');
        const fbTour = $('<a>').prop('href', state.facebook_tour_dates_url);
        const howManyEvents = $('<p>').text(`${state.name} has
          ${state.upcoming_event_count} upcoming events`);
        const fbPage = $('<a>').prop('href', state.facebook_page_url);

        fbTour.text('Facebook Tour Page');
        fbPage.text('Facebook Page');
        resultsDiv
        .append(h3)
        .append(img)
        .append(fbTour)
        .append(howManyEvents)
        .append(fbPage)
        console.log(state);
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
