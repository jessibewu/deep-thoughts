import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';

import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
// instruct the Apollo instance in App.js to retrieve the user loggedIn token from localStorage every time we make a GraphQL API request
// `setContext` can create essentially a middleware function that will retrieve the token for us and combine it with the existing httpLink
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: '/graphql',
});

// use the setContext() function to retrieve the token from localStorage and set the HTTP request headers of every request to include the token, 
//  whether the request needs it or not. This is fine, because if the request doesn't need the token, our server-side resolver function won't check for it
// In this case, we don't need the 1st parameter offered by setContext() the library provides, which stores the current request object in case this function is running after we've initiated a request
//  since we still need to access the 2nd parameter, we can use an underscore `_` to serve as a placeholder for the 1st parameter
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  // need to combine the `authLink` & `httpLink` objects so that every request retrieves the token and sets the request headers before making the request to the API
  // This way, our server can receive the request, check the token's validity, and allow us to continue our request if it's valid
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
    <Router>
    <div className='flex-column justify-flex-start min-100-vh'>
      <Header />
      <div className='container'>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/signup" component={Signup} />
        {/* `?` means this parameter is optional,  */}
        {/* so /profile and /profile/myUsername will both render the Profile component */}
        <Route exact path="/profile/:username?" component={Profile} />
        <Route exact path="/thought/:id" component={SingleThought} />     
        
        <Route component={NoMatch} />
      </Switch> 
      </div>
      <Footer />
    </div>
    </Router>
    </ApolloProvider>
  );
}

export default App;
