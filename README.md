# webPortalTask

Steps to run the web portal task

1. Clone the repository
```bash
git clone https://github.com/Zahkklm/webPortalTask.git
```

2. Change into the directory
```bash
cd webPortalTask
```

3. Create a `.env` file and set the following variables:
```
API_USER=365
API_PASS=1
API_AUTH_HEADER=QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz
```
4. Build and run the docker image
```bash
docker build -t webportaltask .
docker run -p 8080:80 webportaltask
```

5. Open the browser and go to http://localhost:8080/

## Unit Tests
To run the unit tests, run the following command:

Frontend Unit Tests: ([npm](https://nodejs.org/en/download) is required)
```bash
npm install
npm run test
```

Backend Unit Tests: ([composer](https://getcomposer.org/download/) is required)
```bash
composer install
./vendor/bin/phpunit BackendTest.php
``` 


