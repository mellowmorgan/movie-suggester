export default class GenreFinder{
  static makeGenreCall(stringIDs){
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=1&with_genres=${stringIDs}&with_original_language=en`)
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
