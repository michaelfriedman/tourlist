(function() {
  'use strict';
  $('select').material_select();
  $('#arrow').hide();
  const clearSearch = function() {
    $('#search-input[type=text], textarea').val('');
  };

  $('#clear').click(() => {
    localStorage.clear();
    location.reload()
  });

  const loadRecentSearches = function() {
    const recentSearches = JSON.parse(localStorage.getItem('searches')) || [];

    for (const search of recentSearches) {
      // console.log(search)

      JSON.parse(localStorage.getItem(search.facebook_page_url))
      const obj = JSON.parse(localStorage.getItem(search))

      console.log(obj)
      const href = obj.facebook_page_url
      const imgSrc = obj.thumb_url
      console.log(href)
      const recentSearchLI = $('<a>').prop({href: href, text: search, class: 'collection-item'})
      $('#recent-searches').prepend(recentSearchLI);
    }
  };
  loadRecentSearches()

  const storeRecentSearches = function(input) {
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    if (searches.includes(input)) {
      input = null;
    }
    let i = searches.length;
    if (input !== '' && input !== null) {
      searches[i] = input;
      localStorage.setItem('searches', JSON.stringify(searches));
    }
    else {
      return;
    }

  }

  const renderEvents = function(state) {
    const shows = state;

    for (const show of shows) {
      const collectionDiv = $('<ul>')
        .prop('class', 'collection with-header center');
      const liHeader = $('<li>')
        .prop({ class: 'collection-header', id: 'events-header' });
      let showTitle;
      const city = $('<li>').prop({ class: 'collection-item' })
        .text(show.formatted_location);
      const venue = $('<li>').prop('class', 'collection-item')
        .text(show.venue.place);
      const showDateContainer = $('<li>').prop('class', 'collection-item');
      const showDirectionsContainer = $('<a>')
        .prop({ class: 'collection-item', href: `http://maps.google.com/maps?q=${show.venue.latitude},${show.venue.longitude}`, text: 'Directions to Venue' });
      let ticketsAvailableContainer = $('<a>')
        .prop({ class: 'btn', href: show.ticket_url, text: 'Buy Tickets' });

      show.ticket_url === null
      ? ticketsAvailableContainer = $('<li>')
        .prop({
          class: 'collection-item'
        }).text(`Tickets are ${show.ticket_status}.`)
      : ticketsAvailableContainer = $('<li>')
        .prop({
          class: 'collection-item'
        }).append(ticketsAvailableContainer);

      showDateContainer.text(show.formatted_datetime);
      show.title.length > 35
        ? showTitle = $('<h4>').text(`${show.title.slice(0, 35)}...`)
        : showTitle = $('<h4>').text(show.title);
      liHeader.append(showTitle);
      collectionDiv.append(liHeader)
      .append(showDateContainer)
      .append(venue)
      .append(city)
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
    $('#profile').empty();

    const recentSearches = JSON.parse(localStorage.getItem(state.name)) || [];

    for (const search of recentSearches) {
      const recentSearchLI = $('<li>').text(search);
        console.log(JSON.parse(localStorage.getItem(search)))

      $('#recent-searches').prepend(recentSearchLI);
    }


    localStorage.setItem(state.name.toLowerCase(), JSON.stringify(state));
    const rowDiv = $('<div>').prop('class', 'row');
    const profileImg = $('<img>')
      .prop({ src: state.thumb_url, class: 'profileImg' });
    const profileDiv = $('<ul>')
      .prop('class', 'collection with-header center');
    const profileHeader = $('<li>')
      .prop('class', 'collection-header profileHeader');
    const artistTitle = $('<h5>').text(state.name);
    let detailsContainer;

    state.name.slice(-1) === 's'
    ? detailsContainer = $('<li>').prop('class', 'collection-item')
      .text(`${state.name} Have ${state.upcoming_event_count} Shows`)
    : detailsContainer = $('<li>').prop('class', 'collection-item')
      .text(`${state.name} Has ${state.upcoming_event_count} Upcoming Shows`);
    const linkContainer = $('<a>')
      .prop({ class: 'collection-item', href: state.facebook_page_url })
      .text('Facebook');
    const linkContainer2 = $('<a>')
      .prop({ class: 'collection-item', href: state.facebook_tour_dates_url })
      .text('Tour Page');

    profileHeader.append(profileImg).append(artistTitle);
    profileDiv.append(profileHeader)
    .append(detailsContainer).append(linkContainer2)
    .append(linkContainer);
    rowDiv.append(profileDiv);
    $('#profile').append(rowDiv);
    $('#arrow').show();
    $('html, body').animate({
      scrollTop: $('#hotLink').offset().top
    }, 1000);
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
    storeRecentSearches(input);
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
    $('.artistName, .profile, .detailsDiv').empty();

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
        $('html, body').animate({
          scrollTop: $('#hotLink').offset().top
        }, 1000);
      },
      dataType: 'jsonp'
    });
  };

  $('#search-input').keyup((event) => {
    const code = event.which;
    const input = $('#search-input').val();

    if (code === 13) {
      if ($('input:checkbox').is(':checked')) {
        storeRecentSearches(input)
        advancedSearch(input);
      }
      else {
        $('.results').empty();
        $('.artistName, .profileDiv, .detailsDiv').empty();
        storeRecentSearches(input)
        getArtists(input);
      }
    }
  });

  $('.search-button').click(() => {
    const input = $('#search-input').val();
    storeRecentSearches(input)


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
  $('.button-collapse').sideNav();
})();
