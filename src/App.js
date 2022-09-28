import React,{useCallback, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';
import AddMovie from './components/AddMovie';

function App() {
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

 

   const MoviesHandler = useCallback( async () =>{
       setIsLoading(true);
       setError(null);
    try{
      const response =  await fetch('https://react-http-66f0a-default-rtdb.firebaseio.com/movies.json');
      if(!response.ok){
        throw new Error("Something Went Wrong!!!");
      }
      const data = await response.json();
      // console.log(data);
      const loadedMovie = [];

      for(const key in data){
        loadedMovie.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releseDate: data[key].releseDate
        });
      }
        setMovies(loadedMovie) ;
        setIsLoading(false);
      }catch(error){
          setError(error.message);

      }
      setIsLoading(false);
    
    },[])

    useEffect(() =>{
      MoviesHandler();
    },[MoviesHandler])

   async function addMovieHandler (movie){
     const response =   fetch('https://react-http-66f0a-default-rtdb.firebaseio.com/movies.json',{
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json' 
        }
      });

      const data = await response.json();
      console.log(data);

    }
  
  return (
    <React.Fragment>
    <section>
      <AddMovie onAddMovie = {addMovieHandler}/>
    </section>
      <section>
        <button onClick={MoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isloading && movies.length >0 && <MoviesList movies={movies} />}
        {!isloading && movies.length ===0 && <p>No movies Found...</p>}
        {!isloading && error && <p>{error}</p>}
        {isloading && <p>Loading.....</p>}
      </section>
    </React.Fragment>
  );
  }


export default App;
