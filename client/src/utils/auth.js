import decode from 'jwt-decode';

// creating a new JavaScript class & instantiate a new version of for every component that imports it. 
// This isn't always necessary, but it does ensure we are using a new version of the functionality and takes some of the risk out of leaving remnant data hanging around
class AuthService {
    // retrieve data saved in token
    getProfile() {
      return decode(this.getToken());
    }
  
    // check if the user is still logged in
    // if we call the `.loggedIn()` method from a component, we'll get a simple true or false in return, 
    //  but the functionality itself will rely on other methods to get to that response. 
    //  If we call `.login()`, we'll accept the token, set it to localStorage, and refresh the app
    loggedIn() {
      // Checks if there is a saved token and it's still valid
      const token = this.getToken();
      // use type coersion to check if token is NOT undefined and the token is NOT expired
      return !!token && !this.isTokenExpired(token);
    }
  
    // check if the token has expired
    isTokenExpired(token) {
      try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  
    // retrieve token from localStorage
    getToken() {
      // Retrieves the user token from localStorage
      return localStorage.getItem('id_token');
    }
  
    // set token to localStorage and reload page to homepage
    login(idToken) {
      // Saves user token to localStorage
      localStorage.setItem('id_token', idToken);
      // reload page
      window.location.assign('/');
    }
  
    // clear token from localStorage and force logout with reload
    logout() {
      // Clear user token and profile data from localStorage
      localStorage.removeItem('id_token');
      // this will reload the page and reset the state of the application
      window.location.assign('/');
    }
  }

export default new AuthService();