export class MovieFinder {
  static makeMovieCall(stringIDs,keywords,castListIDs){ 
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=popularity.desc&include_video=false&page=1&with_genres=${stringIDs}&with_original_language=en&with_keywords=${keywords}&with_cast=${castListIDs}`)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }) 
      .catch(function(error) {
        return error;
      });
  }

  static keywordFinder(keyword) {
    return fetch(`https://api.themoviedb.org/3/search/keyword?api_key=${process.env.API_KEY}&query=${keyword}`)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }) 
      .catch(function(error) {
        return error;
      });
  }

  static getCastID(name) {
    return fetch(`https://api.themoviedb.org/3/search/person?api_key=${process.env.API_KEY}&query=${name}`)
      .then(function(response) {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      }) 
      .catch(function(error) {
        return error;
      });
  }

  static getMoviesOfCast(stringOfCastIDs) {
    return fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&with_people=${stringOfCastIDs}`)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    }) 
    .catch(function(error) {
      return error;
    });
  }

  static getMovieInfo(title) {
    return fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&query=${title}`)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json(); 
    }) 
    .catch(function(error) {
      return error;
    });
  }

  static getMovieByID(id) {
    return fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.API_KEY}`)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json(); 
    }) 
    .catch(function(error) {
      return error;
    });
  }

  static getCredits(id) {
    return fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.API_KEY}`)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json(); 
    }) 
    .catch(function(error) {
      return error;
    });
  }

  static getKeywords(id) {
    return fetch(`https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${process.env.API_KEY}`)
    .then(function(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json(); 
    }) 
    .catch(function(error) {
      return error;
    });
  }
}
