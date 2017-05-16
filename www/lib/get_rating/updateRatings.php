<?php
    $host_name  = "db680429890.db.1and1.com";
    $database   = "db680429890";
    $user_name  = "dbo680429890";
    $password   = "on14-beeroundTheWorld";


    // // Create connection
    // $conn = mysqli_connect($host_name, $user_name, $password, $database);
    // // Check connection
    // if (!$conn) {
    //     die("Connection failed: " . mysqli_connect_error());
    // }

//     $beerid = '17uR4';
//
//
//    function getAverage($beerid){
//     // $beerid = mysqli_real_escape_string($conn, $beerid);
//
//     $result = mysqli_query($conn, "SELECT beerid, AVG(rating) FROM ratings WHERE beerid=('$beerid');");
//       print_r ($result);
//
//       while($row = mysqli_fetch_assoc($result)) {
//         echo "beerid: " . $row["beerid"]. " - average rating: " . $row["AVG(rating)"]. "<br>";
//       }
//        /* free result set */
//        mysqli_free_result($result);
//
//     }
// getAverage("17uR4");
// //


    $conn = new mysqli($host_name, $user_name, $password, $database);
    if ($mysqli->connect_errno) {
        echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
    }
    $beerid = '17uR4';
    $avg = $conn->query("SELECT beerid, AVG(rating) FROM ratings WHERE beerid=('".$beerid."')");
    $row = $avg->fetch_assoc();
    echo json_encode($row);
    mysqli_close($conn);
