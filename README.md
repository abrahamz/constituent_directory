# Constituent Directory
API for storing and retrieving constituents

# To Get started
Requirements: Postgres, Node, NPM, 

Create Postgres database: constituent_directory
Ensure or Create Postgres Login: postgres with login priveleges

npm install

npm start

** WARNING **
At this point every time the code is run the database will be refreshed to an empty state

# Endpoints

| Method | Pattern | Action |
| ------ | ------- | ------ |
| GET | localhost:3000/ | unused home page |
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

## Bulk Upload

Bulk creation of Constituents can be done via uploading a CSV file to the localhost:3000/constituents/bulk endpoint. An example of the file can be found here: ./constituent.csv.
