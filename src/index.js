import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


// say we have genres to choose id='choose-genre' and chosen 'chosen-genre'
// $('choose-genre').on('click', 'checkbox', () => {
//     this.hide
//     chosen-genre.append
// })

// then the reverse to remove a chosen item if they decide not to use it

$("#add-genre").on("click", () => {
  let option = $("#genre :selected");
  if (option.val() !== "" && option.prop("disabled") === false) {
    $("#selected-genres").append(`
      <button class="btn btn-success tag-btn" type="button" value="${option.val()}"">${option.text()} <span class="tag-btn-x">X</span></button>
    `);
    option.prop("disabled", true);
  }
});

$("#selected-genres").on("click", "button", function() {
  let button = $(this);
  $(`#genre option[value=${button.val()}]`).prop("disabled", false);
  button.remove();
});