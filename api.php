<?php
header('Content-Type: application/json');

function getRandomQuote() {
    $url = 'https://api.quotable.io/random';
    
    $options = [
        'http' => [
            'method' => 'GET',
            'ignore_errors' => true,
        ],
    ];

    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        return ['error' => 'Failed to connect to quote API.'];
    }
    
    return json_decode($result, true);
}

// Get a random quote
$quoteData = getRandomQuote();

// Format the response
if (isset($quoteData['error']) || isset($quoteData['statusCode'])) {
    $responseData = [
        'status' => 'error',
        'message' => $quoteData['error'] ?? $quoteData['statusMessage'] ?? 'Unknown error'
    ];
} else {
    $responseData = [
        'status' => 'success',
        'quote' => $quoteData['content'] ?? 'No quote available.',
        'author' => $quoteData['author'] ?? 'Unknown'
    ];
}

// Send the JSON response
echo json_encode($responseData);
?>