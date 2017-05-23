<?php

require 'DatabaseHelper.php';

class Ratings
{
    function updateRatings($beerId)
    {
        $database = new DatabaseHelper();
        $avgRatings = $database->getValues("SELECT beerid, AVG(rating) 
                                      FROM ratings 
                                      WHERE beerid = ('" . $beerId . "')");
        foreach ($avgRatings as $avgRating) {
            echo $avgRating . PHP_EOL;
        }
    }

}

$shell = new Ratings();
$shell->updateRatings('17uR4');