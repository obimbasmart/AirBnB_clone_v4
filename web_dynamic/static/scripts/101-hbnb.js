/**
 * jQuery - make Airbnb clone dynamic content
 * fetch data from backend api
 */

$(document).ready(function () {

    update_article_container() /**update view from back-end api */

    $.get("http://0.0.0.0:5001/api/v1/status/", function (data, response, xhr) {
        if (data.status === "OK") {
            $('#api_status').css({ backgroundColor: "#ff545f" })
        }
    })

    let amenity_checklist = [];
    let state_checklist = []
    let city_checklist = []

    $('.amenity_checkbox').on('change', function () {
        amenity_checklist = checkbox_callback(this, '.amenities h4', amenity_checklist)
    });

    $('.state_checkbox').on('change', function () {
        state_checklist = checkbox_callback(this, '.locations h4', state_checklist)
    });

    $('.city_checkbox').on('change', function () {
        city_checklist = checkbox_callback(this, '.locations h4', city_checklist)
    });


    $('#search_button').on('click', function () {
        $('.article-container article').remove()
        update_article_container(
            data = {
                "amenities": amenity_checklist.map(amenity => amenity.id),
                "states": state_checklist.map(state => state.id),
                "cities": city_checklist.map(city => city.id)
            })
    })

});


function checkbox_callback(checkbox, selector, checklist) {
    if (checkbox.checked) {
        checklist.push({
            id: checkbox.dataset.id,
            name: checkbox.dataset.name
        });
    } else {
        checklist = checklist.filter(item => item.id !== checkbox.dataset.id);
    }

    $(selector).html(checklist.map(item => item.name).join(', '));
    return checklist
}

function update_article_container(data = {}) {
    $.ajax(
        {
            url: "http://0.0.0.0:5001/api/v1/places_search/",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: (response) => {
                $.each(response, function (idx, place) {
                    $('.article-container').append(
                        `
                 <article>
                  <div class="article_header">
                      <h2>${place.name}</h2>
                      <div class="price_by_night">
                          $${place.price_by_night}
                      </div>
                  </div>
  
                  <div class="information">
                      <div class="max_guest">
                          <div class="icon">
  
                          </div>
                          <p>${place.max_guest} Guests</p>
                      </div>
  
                      <div class="number_rooms">
                          <div class="icon">
  
                          </div>
                          <p>${place.number_rooms} Bedroom</p>
  
                      </div>
  
                      <div class="number_bathrooms">
                          <div class="icon">
  
                          </div>
                          <p> ${place.number_bathrooms} Bathroom</p>
  
                      </div>
  
                  </div>
  
                  <div class="user">
                      <p><span class="user_name">Owner:</span>N/A</p>
                  </div>
  
                  <div class="description">
                      <p>${place.description} </p>
                  </div>

                  <div class="reviews">
                            <h2><span class="show_hide">show</span>Reviews</h2>

                            <ul>
                            </ul>
                        
                </div>

              </article>
                  `
                    )
                })

                const reviews = $('.reviews ul')
                $.each(response, (idx, place) => {
                    $.ajax(
                        {
                            url: "http://0.0.0.0:5001/api/v1/places/" + place.id + "/reviews/",
                            method: "GET",
                            success: (data) => {
                                $.each(data, (idy, review) => {
                                    //get user for the place
                                    $.get("http://0.0.0.0:5001/api/v1/users/" + review.user_id, function (data) {
                                        user_name = data.first_name + ' ' + data.last_name

                                        $(reviews[idx]).append(
                                            `
                                                <li>
                                                    <h3>From ${user_name} - 23th of August 2022</h3>
                                                    <p>${review.text}</p>
                                                </li>
                                                `)
                                    });

                                })
                            }
                        }
                    )
                })

                $.each($('.show_hide'), function (idx, item) {
                    $(item).on('click', () => {
                        const reviews = $(this).closest('h2').next('ul')
                        $(reviews).toggle(320, function () {
                            let show_hide = $(reviews).is(':visible') ? 'hide' : 'show';
                            $(item).text(show_hide)
                        })
                    })
                })
            }
        }
    )
}