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
            results.login = { success: true, token: 'REDACTED' };
            testEndpoints(token);
        } else {
            // Try fallback
            const fallbackOptions = { ...loginOptions, path: '/auth/login' };
            const req2 = https.request(fallbackOptions, (res2) => {
                let data2 = '';
                res2.on('data', (chunk) => data2 += chunk);
                res2.on('end', () => {
                    if (res2.statusCode === 200) {
                        const response = JSON.parse(data2);
                        results.login = { success: true, path: '/auth/login' };
                        testEndpoints(response.accessToken);
                    } else {
                        results.login = { success: false, statusCode: res2.statusCode };
                        fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
                    }
                });
            });
            req2.write(loginData);
            req2.end();
        }
    });
});

req.on('error', (error) => {
    results.error = error.message;
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
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

    let completed = 0;

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
            results[path] = res.statusCode;
            completed++;
            if (completed === variations.length) {
                fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
            }
        });
        req.end();
    });
}
