
1. Register a new user

In a new terminal, execute:

1 curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}' http://localhost:5011/api/auth/register -k
You should get an "OK" response.

2. Log in to get a JWT

Then, log in to retrieve your JWT:

1 curl -X POST -H "Content-Type: application/json" -d '{"email": "test@example.com", "password": "password123"}' http://localhost:5011/api/auth/login -k
Copy the token from the JSON response:
1 {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}

3. Access the protected endpoint

Finally, use your copied token to access the protected endpoint (replace YOUR_TOKEN):
1 curl -X GET -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5011/api/hello -k
A valid token will return:

1 {"message":"Hello, test@example.com (ID: ...)! You are authenticated."}
Invalid tokens will result in a 401 Unauthorized error.
