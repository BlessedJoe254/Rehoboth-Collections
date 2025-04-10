<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Database configuration
$db_host = 'localhost';
$db_name = 'power';
$db_user = 'root';
$db_pass = '';

// Create connection
$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        "status" => "error",
        "message" => "Connection failed: " . $conn->connect_error
    ]));
}

// Check request method
$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method == "POST") {
    // Handle POST requests (for storing data)
    $data = json_decode(file_get_contents("php://input"));

    // Validate data
    if (!empty($data->voltage) && !empty($data->current)) {
        // Sanitize input
        $voltage = floatval($data->voltage);
        $current = floatval($data->current);
        $datetime = date("Y-m-d H:i:s"); // Current datetime

        // Prepare SQL statement
        $stmt = $conn->prepare("INSERT INTO analy (voltage, current, datetime) VALUES (?, ?, ?)");
        $stmt->bind_param("dds", $voltage, $current, $datetime);

        // Execute and respond
        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode([
                "voltage" => $voltage,
                "current" => $current,
                "datetime" => $datetime
            ]);
        } else {
            http_response_code(503);
            echo json_encode([
                "status" => "error",
                "message" => "Unable to insert data",
                "error" => $stmt->error
            ]);
        }
        
        $stmt->close();
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error",
            "message" => "Missing voltage or current data"
        ]);
    }
} elseif ($request_method == "GET") {
    // Handle GET requests (for fetching data)
    
    // Option 1: Get only the latest reading (for dashboard)
    $sql = "SELECT voltage, current FROM analy ORDER BY datetime DESC LIMIT 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $row = $result->fetch_assoc();
        echo json_encode([
            "voltage" => $row["voltage"],
            "current" => $row["current"]
        ]);
    } else {
        // Return default values if no data exists
        echo json_encode([
            "voltage" => 0,
            "current" => 0
        ]);
    }
    
    /* 
    // Option 2: Get multiple readings (for charts)
    // Uncomment this if you want to fetch multiple records for charts
    $sql = "SELECT voltage, current, datetime FROM analy ORDER BY datetime DESC LIMIT 50";
    $result = $conn->query($sql);
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = [
            "voltage" => $row["voltage"],
            "current" => $row["current"],
            "datetime" => $row["datetime"]
        ];
    }
    
    echo json_encode($data);
    */
} else {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Method not allowed"
    ]);
}

$conn->close();
?>

