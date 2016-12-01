(function() {
  'use strict';
  $('button').click(() => {
    $('.results').empty()
    const getArtists = () => {
      const input = $('input').val();

      $('input[type=text], textarea').val('');
      $.ajax({
        type: 'GET',
        url: `http://api.bandsintown.com/artists/${input}.json?api_version=2.0&app_id=michaelfriedman`,
        success: (state) => {
          const h3 = $('<h3>').text(state.name);
          const resultsDiv = $('.results');
          const img = $('<img>').prop('src', state.thumb_url);
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
    getArtists();
  });
  const getEvents = (input) => {
    $.ajax({
      type: 'GET',
      url: `http://api.bandsintown.com/artists/${input}/events.json?api_version=2.0&app_id=michaelfriedman`,
      success: (state) => {
        const events = state;
        const resultsDiv = $('.results');

        for (const event of events) {
          const showName = event.title;
          const eventDateTime = event.formatted_datetime;
          const ticketStatus = event.ticket_status;
          const ticketURL = event.ticket_url;
          const eventLong = event.venue.longitude;
          const eventLat = event.venue.latitude;
          const venueLink = $('<a>');
          // const eventID = event.id
          const h5 = $('<h5>');
          const h4 = $('<h4>');
          const ticketLink = $('<a>');

          ticketLink.prop('href', ticketURL);
          venueLink.prop('href', `http://maps.google.com/maps?q=${eventLat},${eventLong}`).css('display', 'block');
          venueLink.id = 'venue-link';
          venueLink.text('Get Directions to the Venue');
          ticketLink.text(ticketStatus);
          h4.text(showName);
          h5.text(eventDateTime);
          resultsDiv
          .append(h4)
          .append(h5)
          .append(ticketLink)
          .append(venueLink)
          console.log(showName);
          console.log(event);
        }
      },
      dataType: 'jsonp'
    });
  };
})();
