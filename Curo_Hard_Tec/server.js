const express = require('express');
const app = express();
const { auth } = require('express-oauth2-jwt-bearer');
const path = require('path');

const port = process.env.PORT || 8081;

// Auth0 Configuration (from user request)
const jwtCheck = auth({
    audience: 'razaabbascnc@gmail.com',
    issuerBaseURL: 'https://curohardtech.uk.auth0.com/',
    tokenSigningAlg: 'RS256'
});

// 1. Serve Static Files (Publicly Accessible)
// We serve these BEFORE jwtCheck so users can see the website without logging in first.
app.use(express.static(path.join(__dirname, '.')));

// 2. Protect Specific API Routes
// Only endpoints below this line require a valid Access Token
app.get('/authorized', jwtCheck, function (req, res) {
    res.send('Secured Resource: You have accessed a protected endpoint.');
});

// 3. Fallback to index.html for SPA-like navigation (if needed)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Access the site at http://localhost:${port}`);
    console.log(`Test protected route at http://localhost:${port}/authorized`);
});
