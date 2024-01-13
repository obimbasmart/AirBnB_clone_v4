/**
 * jQuery - get dynamic content
 */

$(document).ready(function () {

  $.ajax(
    {
      url: "http://0.0.0.0:5001/api/v1/places_search/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({}),
      success: (response) => {
        $.each(response, function (idx, place) {
          $('.article-container').append(
            `
               <article>
                <div class="article_header">
                    <h2>${ place.name }</h2>
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
  let checklist = [];
  $('.amenity_checkbox').on('change', function () {
    if (this.checked) {
      checklist.push({
        id: this.dataset.id,
        name: this.dataset.name
      });
      console.log(checklist);
      $('.amenities h4').text(checklist.map(item => item.name).join(', '));
    } else {
      checklist = checklist.filter(item => item.id !== this.dataset.id);
      console.log(checklist);
      $('.amenities h4').text(checklist.map(item => item.name).join(', '));
    }
  });


  $.get("http://0.0.0.0:5001/api/v1/status/", function (data, response, xhr) {
    if (data.status === "OK") {
      $('#api_status').css({ backgroundColor: "#ff545f" })
    }
  })

});
