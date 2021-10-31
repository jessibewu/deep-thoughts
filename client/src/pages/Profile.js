import React from 'react';
// Redirect: like `location.replace()` but not reloading the browser
import { Redirect, useParams } from 'react-router-dom';
// Queries / Mutations:
import { useQuery, useMutation } from '@apollo/client';
import { QUERY_USER, QUERY_ME } from '../utils/queries';
import { ADD_FRIEND } from '../utils/mutations';

import ThoughtList from '../components/ThoughtList';
import FriendList from '../components/FriendList';
import ThoughtForm from '../components/ThoughtForm';

import Auth from '../utils/auth';

const Profile = () => {
  //mutations: destructure the mutation function from ADD_FRIEND to use it in a click function
  const [addFriend] = useMutation(ADD_FRIEND);

  //useParams Hook retrieves the username from the URL
  const { username: userParam } = useParams();

  //which is then passed to the useQuery Hook
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam }
  });

  //The user object that is created afterwards is used to populate the JSX
  //This includes passing props to the ThoughtList component to render a list of thoughts unique to this user
  const user = data?.me || data?.user || {};

  // redirect to personal profile page if profile/:username is the logged-in user's
  // if user is loggedIn() and if so, if the username stored in the JSON Web Token is the same as the userParam value
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }
  
  // handleClick(): to utilize the addFriend() mutation function imported
  const handleClick = async () => {
    try {
      await addFriend({
        variables: { id: user._id }
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>

        {userParam && (
        <button className="btn ml-auto" onClick={handleClick}>
          Add Friend
        </button>
      )}
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
        <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>
        <div className="col-12 col-lg-3 mb-3">
        <FriendList
          username={user.username}
          friendCount={user.friendCount}
          friends={user.friends}
        />
      </div>
     </div>
     <div className="mb-3">{!userParam && <ThoughtForm />}</div>
    </div>
  );
};

export default Profile;
