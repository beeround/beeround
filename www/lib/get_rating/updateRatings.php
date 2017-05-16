<?php
    $host_name  = "db680429890.db.1and1.com";
    $database   = "db680429890";
    $user_name  = "dbo680429890";
    $password   = "on14-beeroundTheWorld";

$beerid='17uR4';

$conn = new mysqli($host_name, $user_name, $password, $database);
if ($mysqli->connect_errno) {
    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
}

$avg = $conn->query("SELECT beerid, AVG(rating) FROM ratings WHERE beerid = ('" . $beerid . "')");
$row = $avg->fetch_assoc();
echo json_encode($row);
mysqli_close($conn);
