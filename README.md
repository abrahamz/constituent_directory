# Constituent Directory
API for storing and retrieving constituents

# To Get started
Requirements: Postgres, Node, NPM, 

Create Postgres database: constituent_directory
Ensure or Create Postgres Login: postgres with login privileges

npm install

create ./.env file and copy contents of ./.env.example into it

npm run build
npm run migrate
npm run seed

npm start


# Endpoints

| Method | Pattern | Action |
| ------ | ------- | ------ |
| GET | localhost:3000/ | unused home page |
| POST | localhost:3000/login | login endpoint, returns token used to authenticate subsequent API calls |
| GET | localhost:3000/users/ | returns all users |
| POST | localhost:3000/users/ | creates a new user |
| PATCH | localhost:3000/users/:id | updates existing user |
| GET | localhost:3000/users/:id | returns user by ID |
| GET | localhost:3000/constituents/ | returns all constituents |
| POST | localhost:3000/constituents/ | creates a new constituent |
| PATCH | localhost:3000/constituents/:id | updates existing constituent |
| GET | localhost:3000/constituents/:id | returns constituent by ID |
| POST | localhost:3000/constituents/bulk | upload a CSV file to create constituent in bulk |
| GET | localhost:3000/constituents/download | download a CSV file of all of the constituents |


### Log in

To make API calls a user first needs to retrieve a token by preforming a POST call to the /login endpoint with the following in the Body of the post:

```
{
    "id": 1,
    "password": "testing"
}
```

The reponse will include the token in the following format:

```
{
    "token": "{{AUTH_TOKEN}}"
}
```

To make subsequent authorized API calls the auth token must be included in the request header in the following format:

```
Authorization: "Bearer {{SOME_AUTH_TOKEN}}"
```

### Bulk Upload

Bulk creation of Constituents can be done via uploading a CSV file to the /constituents/bulk endpoint. An example of the file can be found here: ./constituent.csv.

### Logging

Logs can be found here for dev logs: ./dev.log and exception logs: ./exceptions.log
