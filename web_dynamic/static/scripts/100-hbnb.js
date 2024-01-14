/**
 * jQuery - get dynamic content
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


function checkbox_callback(checkbox, selector,checklist) {
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
                console.log(response)
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
              </article>
                  `
                    )
                })
            }
        }
    )
}