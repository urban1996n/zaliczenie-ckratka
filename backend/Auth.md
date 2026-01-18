
1. Register a new user

In a new terminal, execute:

1 curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}' http://localhost:5010/api/auth/register -k
You should get an "OK" response.

2. Log in to get a JWT

Then, log in to retrieve your JWT and refresh token:

1 curl -X POST -H "Content-Type: application/json" -d '{"email": "test@test.com", "password": "utr12345"}' http://localhost:5010/api/auth/login -k
Copy the token and refresh token from the JSON response:
1 {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","refreshToken":"..."}

3. Refresh the token

When your access token expires, use the refresh token to get a new one:

1 curl -X POST -H "Content-Type: application/json" -d '{"refreshToken": "CkB/K3zDnZAUEaomiim15Mbm5HaepVDIS/wP1eoPJwg="}' http://localhost:5010/api/auth/refresh -k'
This will return a new access token and a new refresh token.

4. Access the protected endpoint

Finally, use your copied token to access the protected endpoint (replace YOUR_TOKEN):
1 curl -X GET -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5010/api/hello -k
A valid token will return:

1 {"message":"Hello, test@example.com (ID: ...)! You are authenticated."}
Invalid tokens will result in a 401 Unauthorized error.
