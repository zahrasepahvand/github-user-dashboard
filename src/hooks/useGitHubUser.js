import { useEffect, useReducer } from 'react';
import { fetchUserProfile } from '../api/github';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { user: action.payload, loading: false, error: null };
    case 'FETCH_ERROR':
      return { user: null, loading: false, error: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useGitHubUser(username) {
  const [state, dispatch] = useReducer(reducer, initialState); 

  useEffect(() => {
    if (!username) {
      dispatch({ type: 'RESET' });
      return;
    }
    
    const controller = new AbortController();
    let cancelled = false;

    dispatch({ type: 'FETCH_START' });
    
    fetchUserProfile(username, { signal: controller.signal })
      .then(data => {
        if(!cancelled) {
            dispatch({ type: 'FETCH_SUCCESS', payload: data }); 
        }
      })
      .catch(err => {
        if(!cancelled && err.name !== 'AbortError'){
            dispatch({ type: 'FETCH_ERROR' , payload: err.message});
        }
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [username]);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
  };
}
