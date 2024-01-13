/**
 * jQuery - get dynamic content
 */

$(document).ready(function () {
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
});
