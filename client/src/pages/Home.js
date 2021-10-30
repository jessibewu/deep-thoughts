import React from 'react';
// allow us to make requests to the GraphQL server we connected to and made available to the application using the <ApolloProvider> component in App.js earlier
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';
import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import Auth from '../utils/auth';

const Home = () => {
   // thoughts dataL use useQuery hook to make query request
   const { loading, data } = useQuery(QUERY_THOUGHTS);

   // me_basic data: use object destructuring to extract `data` from the `useQuery` Hook's response and rename it `userData` to be more descriptive
   // if the user is logged in and has a valid token, `userData` will hold all of the returned information from our query
   const { data: userData } = useQuery(QUERY_ME_BASIC);

   // optional chaining
   const thoughts = data?.thoughts || [];
   console.log(thoughts);

   // If loggedI, the loggedIn variable will be true; if not, will be false
   const loggedIn = Auth.loggedIn();

  return (
    <main>
      <div className='flex-row justify-space-between'>
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}> 
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
      )}
        </div>
        {loggedIn && userData ? (
        <div className="col-12 col-lg-3 mb-3">
          <FriendList
            username={userData.me.username}
            friendCount={userData.me.friendCount}
            friends={userData.me.friends}
          />
        </div>
      ) : null}
      </div>
    </main>
  );
};

export default Home;
