<?php
require_once __DIR__ . '/CurlClient.php';

function sendErrorResponse($message) {
    echo json_encode(['error' => $message]);
    exit();
}

function fetchAccessToken(CurlClient $curlClient, $apiUser, $apiPass, $apiAuthHeader) {
    $curlClient->init();
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

    $curlClient->setOptions($options);
    $response = $curlClient->execute();

    if (!$response) {
        sendErrorResponse("cURL Error: " . $curlClient->getError());
    }

    $curlClient->close();

    return json_decode($response, true);
}

function fetchTasks(CurlClient $curlClient, $accessToken) {
    $curlClient->init();
    $options = [
        CURLOPT_URL => "https://api.baubuddy.de/dev/index.php/v1/tasks/select",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer " . $accessToken,
            "Content-Type: application/json"
        ],
    ];

    $curlClient->setOptions($options);
    $response = $curlClient->execute();

    if (!$response) {
        sendErrorResponse("cURL Error: " . $curlClient->getError());
    }

    $curlClient->close();

    return json_decode($response, true);
}
