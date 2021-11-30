export class MovieFinder {
  static makeMovieCall(stringIDs,keywords){
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=1&with_genres=${stringIDs}&with_original_language=en&with_keywords=${keywords}`)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.status_message);
        }
        return response.json();
      }) 
      .catch(function(error) {
        return error.message;
      });
  }

  static keywordFinder(keyword) {
    return fetch(`https://api.themoviedb.org/3/search/keyword?api_key=${process.env.API_KEY}&query=${keyword}`)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.status_message);
        }
        return response.json();
      }) 
      .catch(function(error) {
        return error.message;
      });
  }
}
