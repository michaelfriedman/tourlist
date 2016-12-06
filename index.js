(function() {
  'use strict';
  $('.button-collapse').sideNav({
    menuWidth: 300, // Default is 240
    edge: 'right', // Choose the horizontal origin
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
        .prop('class', 'collection with-header');
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
    const fbPage = $('<a>').prop('href', state.facebook_page_url);
    const fbTour = $('<a>').prop('href',
        state.facebook_tour_dates_url).text('Tour Page');
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

  $('#search-input').on('focus', () => {
    clearSearch();
  });

  const advancedSearch = function(input) {
    // const input = $('#search-input').val();
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

var substringMatcher = function(strs) {
  return function findMatches(q, cb) {
    var matches, substringRegex;

    // an array that will be populated with substring matches
    matches = [];

    // regex used to determine if a string contains the substring `q`
    substrRegex = new RegExp(q, 'i');

    // iterate through the pool of strings and for any string that
    // contains the substring `q`, add it to the `matches` array
    $.each(strs, function(i, str) {
      if (substrRegex.test(str)) {
        matches.push(str);
      }
    });

    cb(matches);
  };
};

var artists = ['the string cheese incident', 'phish', 'sts9', 'beats antique', 'kid rock',
  'guns n roses', 'red hot chili peppers', 'dave matthews band', 'u2', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
  'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

$('#the-basics .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'artists',
  source: substringMatcher(artists)
});
