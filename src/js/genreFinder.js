import { ids } from "webpack"

export default class GenreFinder{
  static async makeGenreCall(){
    const response = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${}&language=en-US&sort_by=popularity.desc&include_video=false&page=1&with_genres=878,28&with_original_language=en`);
    
  }
}
