<?php
	$result = '';
	$name = '';
	$config = array(
		'type' => 'block',
		'js' => false,
		'css' => false,
		'images' => false,
		'register' => false,
	);

	if (isset($_POST['name']) && preg_match('#^[a-z0-9._-]+$#i', $_POST['name'])) {
		require 'bin/addblock.inc.php';
		$name = $_POST['name'];
		$config = array_merge($config, $_POST);
		ob_start();
		addBlock($name, $config['type'], $config);
		$result = ob_get_clean();
	}
?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<title>addblock</title>
</head>
<body>
  <h2>Add block form:</h2>
  <form method="post">
	  <label>Block type</label><br/>
	  <label><input type="radio" name="type" value="block" <?php if ($config['type'] === 'block') echo 'checked="checked"'; ?> /> Block</label><br/>
	  <label><input type="radio" name="type" value="page" <?php if ($config['type'] === 'page') echo 'checked="checked"'; ?> /> Page</label><br/>
	  <br/>
	  <label for="name">Block name</label><br/>
	  <input type="text" id="name" name="name" placeholder="[a-z0-9._-]+" pattern="^[a-z0-9._-]+$" value="<?php echo $name; ?>" /><br/>
	  <br/>
	  <label><input type="checkbox" name="css" value="1" checked="checked" /> Add .less file</label><br/>
	  <label><input type="checkbox" name="js" value="1" /> Add .js file</label><br/>
	  <label><input type="checkbox" name="images" value="1" /> Create images directory</label><br/>
	  <label><input type="checkbox" name="register" value="1" checked="checked" /> Register .less file</label><br/>
	  <br/>
	  <button type="submit">Generate</button>
  </form>
  <?php if (!empty($result)): ?>
    <h2>Result:</h2>
    <pre><?php echo $result; ?></pre>
  <?php endif; ?>
</body>
</html>

