import $ from 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

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

$("#add-cast-member").on("click", () => {
  let cast = $("#input-cast-member");
  if (cast.val() !== "") {
    $("#selected-cast-members").append(`
      <button class="btn btn-success tag-btn" type="button" value="//this will be id from API call//"">${cast.val()} <span class="tag-btn-x">X</span></button>
    `);
    cast.val("");
  }
});

$("#selected-cast-members").on("click", "button", function() {
  $(this).remove();
});

$("#add-keyword").on("click", () => {
  let keyword = $("#input-keyword");
  if (keyword.val() !== "") {
    $("#selected-keywords").append(`
      <button class="btn btn-success tag-btn" type="button" value="${keyword.val()}">${keyword.val()} <span class="tag-btn-x">X</span></button>
    `);
    keyword.val("");
  }
});

$("#selected-keywords").on("click", "button", function() {
  $(this).remove();
});