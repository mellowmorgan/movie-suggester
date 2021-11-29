import $ from 'jquery';
import ''
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';


let genres = [];
genres = $("input[name='genres']:checked").map(function() {
  return $(this).val();
}).toArray();