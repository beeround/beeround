<?php

	 //include the API Builder mini lib
	 require_once("api_builder_includes/class.API.inc.php");

	 //set page to output JSON
	 header("Content-Type: application/json; charset=utf-8");

	  //If API parameters were included in the http request via $_GET...
	  if(isset($_GET) && !empty($_GET)){

	  	//specify the columns that will be output by the api as a comma-delimited list
	  	$columns = "beerid,
	  				avg_rating";

	  	//setup the API
	  	$api = new API("db680429890.db.1and1.com",
	  				   "db680429890",
	  				   "beers",
	  				   "dbo680429890",
	  				   "on14-beeroundTheWorld");

	  	$api->setup($columns);
	  	$api->set_default_order("beerid");
	  	$api->set_searchable("beerid, avg_rating, beername, breweryname");
	  	$api->set_default_search_order("beerid");
	  	$api->set_pretty_print(true);

	  	//sanitize the contents of $_GET to insure that
	  	//malicious strings cannot disrupt your database
	 	$get_array = Database::clean($_GET);

	 	//output the results of the http request
	 	echo $api->get_json_from_assoc($get_array);
	}
?>
