<?php
header('Content-Type: application/json');

$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.baubuddy.de/index.php/login",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode(["username" => "365", "password" => "1"]),
    CURLOPT_HTTPHEADER => [
        "Authorization: Basic QVBJX0V4cGxvcmVyOjEyMzQ1NmlzQUxhbWVQYXNz",
        "Content-Type: application/json"
    ],
]);

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
    echo json_encode(["error" => "cURL Error: " . $err]);
    exit();
}

$responseData = json_decode($response, true);
$accessToken = $responseData['oauth']['access_token'];

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
    echo json_encode(["error" => "cURL Error: " . $err]);
} else {
    $data = json_decode($response, true);
    
    if (is_array($data) && count($data) > 0) {
        $uniqueData = array_map("unserialize", array_unique(array_map("serialize", $data)));
        echo json_encode($uniqueData);
    } else {
        echo json_encode([]);
    }
}
?>
