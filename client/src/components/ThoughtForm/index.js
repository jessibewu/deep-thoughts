import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';
import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

const ThoughtForm = () => {
  const [thoughtText, setText] = useState('');
  const [characterCount, setCharacterCount] = useState(0);

  // the addThought() function will run the actual mutation
  // `error` variable will initially be undefined but can change depending on if the mutation failed
  const [addThought, { error }] = useMutation(ADD_THOUGHT, {
    // only have to manually update the cache when adding or deleting items from an array
    // manually inserting the new thought object into the cached array. 
    // The useMutation Hook can include an update function that allows us to update the cache of any related queries
    update(cache, { data: { addThought } }) {
        try {
            // could potentially not exist yet, so wrap in a try...catch
            // read what's currently in QUERY_THOUGHTS cache
            const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
            // prepend newest thought
            cache.writeQuery({
              query: QUERY_THOUGHTS,
              data: { thoughts: [addThought, ...thoughts] } // puts newest thought to the top
            });
          } catch (e) {
            console.error(e);
          }
      
          // update me object's cache, appending new thought to the end of the array
          const { me } = cache.readQuery({ query: QUERY_ME });
          cache.writeQuery({
            query: QUERY_ME,
            data: { me: { ...me, thoughts: [...me.thoughts, addThought] } } // puts newest thought to the end
          });
        }
  });

  const handleChange = event => {
    if (event.target.value.length <= 280) {
      setText(event.target.value);
      setCharacterCount(event.target.value.length);
    }
  };
  
  const handleFormSubmit = async event => {
    event.preventDefault();
    
    try {
        // add thought to database
        await addThought({
          variables: { thoughtText }
        });
    
        // clear form value
        setText('');
        setCharacterCount(0);
      } catch (e) {
        console.error(e);
      }
  };

  return (
    <div>
      <p className={`m-0 ${characterCount === 280 ? 'text-error' : ''}`}>
        Character Count: {characterCount}/280
        {error && <span className="ml-2 text-error">Something went wrong...</span>}
      </p>
      <form 
        className="flex-row justify-center justify-space-between-md align-stretch"
        onSubmit={handleFormSubmit}
      >
        <textarea
          placeholder="Here's a new thought..."
          value={thoughtText}
          className="form-input col-12 col-md-9"
          onChange={handleChange}
        ></textarea>
        <button className="btn col-12 col-md-3" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

export default ThoughtForm;