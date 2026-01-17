const https = require('http');

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

console.log('1. Attempting login to get token...');

const req = https.request(loginOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        if (res.statusCode === 200) {
            const response = JSON.parse(data);
            const token = response.accessToken;
            console.log('Login Successful! Token received.');
            testEndpoints(token);
        } else {
            console.error(`Login Failed: ${res.statusCode} ${res.statusMessage}`);
            console.log('Response:', data);

            // Try fallback login path if /api/auth/login fails
            console.log('Retrying login with /auth/login...');
            const fallbackOptions = { ...loginOptions, path: '/auth/login' };
            const req2 = https.request(fallbackOptions, (res2) => {
                let data2 = '';
                res2.on('data', (chunk) => data2 += chunk);
                res2.on('end', () => {
                    if (res2.statusCode === 200) {
                        const response = JSON.parse(data2);
                        console.log('Fallback Login Successful!');
                        testEndpoints(response.accessToken);
                    } else {
                        console.error('All login attempts failed.');
                    }
                });
            });
            req2.write(loginData);
            req2.end();
        }
    });
});

req.on('error', (error) => {
    console.error('Login Error:', error);
});

req.write(loginData);
req.end();

function testEndpoints(token) {
    const variations = [
        '/api/users/profile/me',
        '/users/profile/me',
        '/api/user/profile/me',
        '/user/profile/me'
    ];

    console.log('\n2. Testing Profile Endpoints...');

    variations.forEach(path => {
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
            console.log(`[${res.statusCode}] ${path}`);
        });
        req.end();
    });
}
