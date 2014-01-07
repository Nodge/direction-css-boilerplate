<?php

require_once 'vendor/autoload.php';

if (isset($_GET['file']) && preg_match('#\.less$#i', $_GET['file'])) {
	$root = dirname(__FILE__);
	$path = $root.$_GET['file'];
	if (file_exists($path)) {
		$parserEnv = new Less_Environment();
		$parserEnv->strictMath = true;
		$parser = new Less_Parser($parserEnv);
		$parser->parseFile($path, 'app/main/css/');
		$css = $parser->getCss();

		header('content-type: text/css');
		echo $css;
	}
	else
		exit('bad request');
}
else
	exit('bad request');