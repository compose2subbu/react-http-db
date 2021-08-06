import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

let dummyMovies = [
  {
    id: 1,
    title: "Some Dummy Movie",
    openingText: "This is the opening text of the movie",
    releaseDate: "2021-05-18",
  },
  {
    id: 2,
    title: "Some Dummy Movie 2",
    openingText: "This is the second opening text of the movie",
    releaseDate: "2021-05-19",
  },
];    

function App() {
  const [movies, setMovies] = useState(dummyMovies);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  //https://react-web-643bc-default-rtdb.asia-southeast1.firebasedatabase.app/
  //https://react-web-643bc-default-rtdb.asia-southeast1.firebasedatabase.app/
  //https://swapi.dev/api/films
  const fetchMoviesHandler = useCallback(async () => {
    setMovies([]);
    setIsLoading(true);
    setError(null);
    try{
      const response = await fetch("https://react-web-643bc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json");
      if(!response.ok) {
        throw new Error('No Movies Recieved');
      }
      const crudeData = await response.json();
      console.log(crudeData);

      const transformedMovies = [];
      for (const key in crudeData){
        transformedMovies.push({
          id: key,
          title: crudeData[key].title,
          openingText: crudeData[key].openingText,
          releaseDate: crudeData[key].releaseDate
        })
      }
      // const transformedMovies = crudeData.results.map((movie) => {
      //   return {
      //     id: movie.episode_id,
      //     title: movie.title,
      //     openingText: movie.opening_crawl,
      //     releaseDate: movie.release_date,
      //   };
      // });
      setMovies(transformedMovies);
    }catch (error){
      setError(error.message);
    }
    
    
    setIsLoading(false);
  }, [])

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler])

  async function addMovieHandler(movie) {
    const response = await fetch('https://react-web-643bc-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',{
      method: 'POST',
      body: JSON.stringify(movie),
      headers: {
        'Content-type': 'application/json'
      }
    })
    const data = response.json();
    console.log(data);
  }

  let content = <MoviesList movies={movies} />

  if(isLoading){
    content = <p>Loading...</p>
  } 

  if(!isLoading && movies.length === 0 && !error){
    content = <p>No Movies Found.</p>
  } 

  if(!isLoading && error){
    content = <p>{error}</p>
  } 

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
