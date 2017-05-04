<?php
    //database information 1und1.de
    $host_name  = "db680429890.db.1and1.com";
    $database   = "db680429890";
    $user_name  = "dbo680429890";
    $password   = "on14-beeroundTheWorld";


    $connect = mysqli_connect($host_name, $user_name, $password, $database);

    if(mysqli_connect_errno())
    {
    echo '<p>Verbindung zum MySQL Server fehlgeschlagen: '.mysqli_connect_error().'</p>';
    }
    else
    {
    echo '<p>Verbindung zum MySQL Server erfolgreich aufgebaut.</p>';
    }
?>
