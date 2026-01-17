const https = require('http');
const fs = require('fs');

const loginData = JSON.stringify({
    email: 'admin@example.com',
    password: '111111'
});

const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
    }
};

const results = {};

const req = https.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            const token = response.accessToken;
            testEndpoints(token);
        } else {
            results.error = "Login failed";
            fs.writeFileSync('results_body.json', JSON.stringify(results, null, 2));
        }
    });
});

req.on('error', (error) => { });

req.write(loginData);
req.end();

function testEndpoints(token) {
    const path = '/api/users/profile/me';

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: path,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };

    const req = https.request(options, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            try {
                results.statusCode = res.statusCode;
                results.body = JSON.parse(body);
            } catch (e) {
                results.body = body; // raw string if not json
            }
            fs.writeFileSync('results_body.json', JSON.stringify(results, null, 2));
        });
    });
    req.end();
}
