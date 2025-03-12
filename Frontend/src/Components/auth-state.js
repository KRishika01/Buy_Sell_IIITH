import axios from "axios";
console.log("Came to file");
const AuthState = {
    isLoggedIn: false,
    currentUser: null,
    token: null,

    login(userData,token) {
        console.log("Came to login");
        this.isLoggedIn = true;
        this.currentUser = userData;
        console.log(this.isLoggedIn);
        this._token = token;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // localStorage.setItem('isLoggedIn', 'true');  // Store as string
        // localStorage.setItem('currentUser', JSON.stringify(userData));
        // localStorage.setItem('token', token);
    },

    logout() {
        console.log("Came to logour");
        this.isLoggedIn = false;
        this.currentUser = null;
        console.log(this.isLoggedIn);
    },

    getAuthStatus() {
        return {
            isLoggedIn: this.isLoggedIn,
            currentUser: this.currentUser
        };
    }
};

export default AuthState;
