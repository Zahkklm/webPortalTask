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

3. Build and run the docker image
```bash
docker build -t webportaltask .
docker run -p 8080:80 webportaltask
```

4. Open the browser and go to http://localhost:8080/

## Unit Tests
To run the unit tests, run the following command:

Frontend Unit Tests: (npm is required)
```bash
npm install
npm run test
```

Backend Unit Tests: (composer is required)
```bash
composer install
./vendor/bin/phpunit BackendTest.php
``` 


