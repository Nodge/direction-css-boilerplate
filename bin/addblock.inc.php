<?php

function addBlock($name, $type = 'block', $options = array()) {
	$config = array_merge(array(
		'js' => true,
		'css' => true,
		'images' => true,
		'register' => true,
		'appPath' => '../..',
		'baseDir' => dirname(__DIR__),
	), $options);

	$blockDir = $config['baseDir'].'/app/'.$type.'s/'.$name;

	if (!file_exists($blockDir)) {
		echo 'Create dir: '.$blockDir.PHP_EOL;
		mkdir($blockDir);
	}

	if ($config['css']) {
		if (!file_exists($blockDir.'/css')) {
			echo 'Create dir: '.$blockDir.'/css'.PHP_EOL;
			mkdir($blockDir.'/css');
		}

		$file = $blockDir.'/css/'.$name.'.less';
		if (!file_exists($file)) {
			echo 'Create file: '.$file.PHP_EOL;
			file_put_contents($file, "\n.".$name." {\n\n}\n");

			if ($config['register']) {
				echo 'Register less file'.PHP_EOL;
				$configFile = $config['baseDir'].'/app/main/css/style.less';
				$data = file_get_contents($configFile);

				if ($type === 'block') {
					$pos = strpos($data, '// pages');
					if ($pos !== false) {
						$pos = strrpos($data, ';', $pos - mb_strlen($data));
						if ($pos !== false) {
							$data =
								substr($data, 0, $pos+1).
								"\n".'@import "'.$config['appPath'].'/blocks/'.$name.'/css/'.$name.'";'.
								substr($data, $pos+1)
							;
						}
					}
				}
				else {
					$data .= '@import "'.$config['appPath'].'/pages/'.$name.'/css/'.$name.'";'."\n";
				}

				file_put_contents($configFile, $data);
			}
		}
	}

	if ($config['images']) {
		if (!file_exists($blockDir.'/images')) {
			echo 'Create dir: '.$blockDir.'/images'.PHP_EOL;
			mkdir($blockDir.'/images');
		}
	}

	if ($config['js']) {
		if (!file_exists($blockDir.'/js')) {
			echo 'Create dir: '.$blockDir.'/js'.PHP_EOL;
			mkdir($blockDir.'/js');
		}

		$file = $blockDir.'/js/'.$name.'.js';
		if (!file_exists($file)) {
			echo 'Create file: '.$file.PHP_EOL;
			file_put_contents($file, "\njQuery(function($) {\n\t$('.".$name."');\n});\n");
		}
	}

	echo 'Done'.PHP_EOL;
}