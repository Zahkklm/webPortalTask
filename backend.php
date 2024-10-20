<?php
header('Content-Type: application/json');

function sendErrorResponse($message) {
    echo json_encode(['error' => $message]);
    exit();
}

// Read .env file and set environment variables
$env = file_get_contents(__DIR__."/.env");
$lines = explode("\n", $env);

foreach ($lines as $line) {
    preg_match("/([^#]+)\=(.*)/", $line, $matches);
    if (isset($matches[2])) {
        putenv(trim($line));
    }
} 

// Retrieve API credentials from environment variables
$apiUser = getenv('API_USER');
$apiPass = getenv('API_PASS');
$apiAuthHeader = getenv('API_AUTH_HEADER');

if (!$apiUser || !$apiPass || !$apiAuthHeader) {
    sendErrorResponse("API credentials are missing.");
}

// Get access token
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.baubuddy.de/index.php/login",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode(["username" => $apiUser, "password" => $apiPass]),
    CURLOPT_HTTPHEADER => [
        "Authorization: Basic $apiAuthHeader",
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    sendErrorResponse("cURL Error: " . $err);
}

$responseData = json_decode($response, true);
if (!isset($responseData['oauth']['access_token'])) {
    sendErrorResponse("Failed to retrieve access token.");
}

$accessToken = $responseData['oauth']['access_token'];

// Fetch tasks
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.baubuddy.de/dev/index.php/v1/tasks/select",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $accessToken,
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    sendErrorResponse("cURL Error: " . $err);
}

$data = json_decode($response, true);

if (!is_array($data) || count($data) === 0) {
    sendErrorResponse("No tasks found.");
}

// Output unique data
$uniqueData = array_map("unserialize", array_unique(array_map("serialize", $data)));
echo json_encode($uniqueData);
?>
