// get host name so that the user can be reddirected to login page after
// password reset
function getHostName() {
    let hostName = window.location.hostname;
    switch (hostName) {
        case "localhost":
            return "http://localhost:8081";
        
        case "127.0.0.1":
            return "http://localhost:8081"; 
    
        default:
            return window.location.hostname
    }
}