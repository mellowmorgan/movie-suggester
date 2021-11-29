import $ from 'jquery';
import GenreFinder from './js/genreFinder.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

function getElements(response) {
  if (response.main) {
    $('.showHumidity').text(`The humidity in ${response.name} is ${response.main.humidity}%`);
    $('.showTemp').text(`The temperature in Kelvins is ${response.main.temp} degrees.`);
  } else {
    $('.showErrors').text(`There was an error: ${response.status_message}`);
  }
}


let genres = [];
genres = $("input[name='genres']:checked").map(function() {
  return $(this).val();
}).toArray();
let genresString = genres.join(',');
GenreFinder.makeGenreCall(genresString)
.then(function(response) {
  getElements(response);
});
