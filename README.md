# Movie Suggester

#### A web application to suggest films based on user-selected filters.

#### By Morgan Waites, Katie Pundt, Aaron Minnick and Frank Proulx. 

## Technologies Used

* HTML/CSS
* Bootstrap
* Javascript/JQuery
* npm
* Webpack
* [TMDB API](https://www.themoviedb.org/documentation/api?language=en-US)

## Description

Movie Suggester web application uses the TMDB API to get movie data to make recommendations to the user. The recommendations are based on the users input and selections in the form shown upon loading the page. Filter options include similar movie title, keywords, genres, and cast members. On submission of the form, a carousel of movie cards appears that the user can click through. The user can then flip each card with the movie poster to reveal each movie's details.

## GitHub Page

See our github page [here](https://mellowmorgan.github.io/movie-suggester/)!

## Setup/Installation Requirements

* Navigate to https://github.com/mellowmorgan/movie-suggester
* Click on the green "Code" button and copy the repository URL or click on the copy button
* Open the terminal on your desktop
* Once in the terminal, use it to navigate to your desktop folder
* Once inside your desktop folder, use the command `git clone https://github.com/mellowmorgan/movie-suggester`
* After cloning the project, navigate into it using the command `cd movie-suggester`
* Use the command `git remote` to confirm the creation of the new local repository
* Create a new file in the root of the project directory called `.env`
* Sign up for an account at [TMDB](https://www.themoviedb.org/) and get a free API key
* In the `.env` file type the following `API_KEY=[YOUR_API_KEY_HERE]` and paste your API key in place of `[YOUR_API_KEY_HERE]` (be sure to remove the square brackets)
* Save the project
* Navigate back to your terminal
* Install project dependencies by running the command `npm install`
* If you receive errors in the terminal, try running `npm install` again, sometimes npm can be finicky
* Then run the command `npm run start` to start the project server and view the application (use ctrl + c to exit the server in the terminal)

## Known Bugs

No known bugs. If the user enters a title, actor, or keyword that doesn't exist, no notification is given, it simply doesn't get added.

## License

[MIT](https://opensource.org/licenses/MIT) Copyright(c) 2021 Morgan Waites, Katie Pundt, Aaron Minnick and Frank Proulx.