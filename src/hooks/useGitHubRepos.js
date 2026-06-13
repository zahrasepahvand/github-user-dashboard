import { useEffect, useReducer } from 'react';
import { fetchUserRepositories } from '../api/github';

const initialState = {
  repos: [],
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { repos: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useGitHubRepos(username) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!username) {
      dispatch({ type: 'RESET' }); 
      return;
    }
    
    const controller = new AbortController();
    let cancelled = false;
    
    dispatch({ type: 'FETCH_START' }); 
    
    fetchUserRepositories(username, { signal: controller.signal })
      .then(data => {
        if (!cancelled) {
          dispatch({ type: 'FETCH_SUCCESS', payload: data }); 
        }
      })
      .catch(err => {
        if (!cancelled && err.name !== 'AbortError') {
          dispatch({ type: 'FETCH_ERROR', payload: err.message }); 
        }
      });
    
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  return {
    repos: state.repos,
    loading: state.loading,
    error: state.error,
  };
}