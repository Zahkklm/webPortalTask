<?php
require_once __DIR__ . '/CurlClient.php';

/**
 * Sends an error response in JSON format and terminates the script.
 *
 * @param string $message The error message to send.
 */
function sendErrorResponse($message) {
    echo json_encode(['error' => $message]);
    exit();
}

/**
 * Fetches an access token from the API using the provided credentials.
 *
 * @param CurlClient $curlClient An instance of the CurlClient to handle the request.
 * @param string $apiUser The API username.
 * @param string $apiPass The API password.
 * @param string $apiAuthHeader The API authorization header.
 * @return array The response from the API containing the access token.
 */
function fetchAccessToken(CurlClient $curlClient, $apiUser, $apiPass, $apiAuthHeader) {
    // Initialize the CurlClient
    $curlClient->init();

    // Set options for the POST request to fetch the access token
    $options = [
        CURLOPT_URL => "https://api.baubuddy.de/index.php/login",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => "POST",
        CURLOPT_POSTFIELDS => json_encode(["username" => $apiUser, "password" => $apiPass]),
        CURLOPT_HTTPHEADER => [
            "Authorization: Basic $apiAuthHeader",
            "Content-Type: application/json"
        ],
    ];

    // Apply the options to the CurlClient
    $curlClient->setOptions($options);

    // Execute the request and retrieve the response
    $response = $curlClient->execute();

    // Check if the response is valid, otherwise send an error response
    if (!$response) {
        sendErrorResponse("cURL Error: " . $curlClient->getError());
    }

    // Close the CurlClient connection
    $curlClient->close();

    // Decode the response JSON and return it
    return json_decode($response, true);
}

/**
 * Fetches tasks from the API using the access token.
 *
 * @param CurlClient $curlClient An instance of the CurlClient to handle the request.
 * @param string $accessToken The access token for authentication.
 * @return array The response from the API containing tasks.
 */
function fetchTasks(CurlClient $curlClient, $accessToken) {
    // Initialize the CurlClient
    $curlClient->init();

    // Set options for the GET request to fetch tasks
    $options = [
        CURLOPT_URL => "https://api.baubuddy.de/dev/index.php/v1/tasks/select",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer " . $accessToken,
            "Content-Type: application/json"
        ],
    ];

    // Apply the options to the CurlClient
    $curlClient->setOptions($options);

    // Execute the request and retrieve the response
    $response = $curlClient->execute();

    // Check if the response is valid, otherwise send an error response
    if (!$response) {
        sendErrorResponse("cURL Error: " . $curlClient->getError());
    }

    // Close the CurlClient connection
    $curlClient->close();

    // Decode the response JSON and return it
    return json_decode($response, true);
}
