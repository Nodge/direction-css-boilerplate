<!DOCTYPE html>
<html dir="ltr" lang="en" class="no-js">
<head>
  <!-- Base url for all relative links -->
  <!--<base href="/" />-->
  
  <!-- Content charset -->
  <meta charset="utf-8" />
  <!--<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />-->
  
  <!-- Common meta tags -->
  <!--<meta name="description" content="" />
  <meta name="keywords" content="" />
  <meta name="author" content="" />
  <meta name="robots" content="index,follow" />-->
  
  <!-- Viewport settings for touch devices (mobile, tablets, etc) -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Mobile IE -->
  <meta name="MobileOptimized" content="width" />
  <meta name="HandheldFriendly" content="true" />

  <!-- Mobile IE allows us to activate ClearType technology for smoothing fonts for easy reading -->
  <!--[if IEMobile]>
    <meta http-equiv="cleartype" content="on" />
  <![endif]-->


	  <!-- Favicons -->
  <!--<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="favicon.ico" />
  <link rel="apple-touch-icon" href="assets/ico/apple-touch-icon.png">
  <link rel="apple-touch-icon" sizes="72x72" href="assets/ico/apple-touch-icon-72x72.png">
  <link rel="apple-touch-icon" sizes="114x114" href="assets/ico/apple-touch-icon-114x114.png">-->
  
  
  <!-- Enable Chrome Frame for IE6-7 users -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <!--[if lte IE 7 ]>
    <script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.2/CFInstall.min.js"></script>
    <script>window.attachEvent("onload",function(){CFInstall.check({mode:"overlay"})})</script>
  <![endif]-->
  
  <!-- Force plug-in-less "Metro IE10" to prompt the user to open the URL in "Desktop IE10" which supports plug-ins. -->
  <!--<meta http-equiv="X-UA-Compatible" content="requiresActiveX=true" />-->
  
  <!-- for IE6-8 support of HTML elements -->
  <!--[if lt IE 9]>
    <script type="text/javascript" src="framework/js/html5.js"></script>
  <![endif]-->
  
  <!-- Suppress IE6's pop-up-on-mouseover toolbar for images, that can interfere with certain designs. -->
  <!--<meta http-equiv="imagetoolbar" content="false" />-->


  <!-- IE9 Pinned Site Settings! Documentation: http://msdn.microsoft.com/en-ca/library/gg131029(VS.85).aspx -->
    
  <!-- Pinned site name, as Windows sees it - this will be the page title by default, unless you include this rule. -->
  <!--<meta name="application-name" content="Sample Title" />-->
    
  <!-- Pinned shortcuts also get a tooltip - this is it. -->
  <!--<meta name="msapplication-tooltip" content="A description of what this site does." />
    
  <!-- If the site should go to a specific URL when it is pinned (such as the homepage), enter it here.
       One idea is to send it to a special URL so you can track # of pinned users, like so: http://www.example.com/index.html?pinned=true -->
  <!--<meta name="msapplication-starturl" content="" />-->
    
  <!-- IE9 will automatically use the overall color of your site's favicon to shade its browser buttons.  UNLESS you give it another color here.
       Only use named colors ("red") or hex colors ("#f00"). -->
  <!--<meta name="msapplication-navbutton-color" content=""/>-->
    
  <!-- If the site should open at a certain window size once pinned, you can specify the dimensions here.
       It only supports static pixel dimensions. 800x600 minimum. -->
  <!--<meta name="msapplication-window" content="width=800;height=600" />-->
    
  <!-- Define Jump List tasks that will appear when the pinned site's
       icon gets a right-click. Each "task" goes to the specified URL,
       and gets its own mini icon (essentially a favicon, a 16x16 .ICO). -->
  <!--<meta name="msapplication-task" content="name=Task 1;action-uri=http://host/Page1.html;icon-uri=http://host/icon1.ico" />-->
  <!--<meta name="msapplication-task" content="name=Task 2;action-uri=http://microsoft.com/Page2.html;icon-uri=http://host/icon2.ico" />-->
  
  
  <!-- Facebook will use the following data to represent your site when it is shared. 
       Facebook documentation (includes info on sharing more specific media types): http://developers.facebook.com/docs/share -->
  <!--<meta property="og:title" content="" />-->
  <!--<meta property="og:description" content="" />-->
  <!--<meta property="og:image" content="" />-->
  
  
  <!-- Signal to search engines and others "Use this URL for this page!"
       Useful when URLs are dynamically generated. -->
  <!--<link rel="canonical" href="" />-->
  
  <!-- Direct search spiders to your sitemap.
       Learn to make a sitemap here: http://www.sitemaps.org/protocol.php -->
  <!--<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />-->

  <!-- Have an RSS feed? Link to it here.
	   Learn how to write your own: http://www.rssboard.org/rss-specification -->
  <!--<link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml" />-->
    
  <!-- Or maybe you have an Atom feed?
   	   See what that's all about: http://www.atomenabled.org/developers/protocol/ -->
  <!--<link rel="alternate" type="application/atom+xml" title="Atom" href="/atom.xml" />-->
  
  
  <!-- Stylesheets -->
  <link type="text/css" rel="stylesheet" href="getless.php?file=/app/main/css/style.less" media="all" />
<!--  <link type="text/css" rel="stylesheet" href="app/compiled.css" media="all" />-->

  
  <!-- Javascript libraries -->
  <script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
  <!--<script type="text/javascript">window.jQuery || document.write('<script src="app/components/bower_components/jquery/jquery.min.js"><\/script>')</script>-->
  
<!--  <script type="text/javascript" src="framework/js/browser.js"></script>-->
<!--  <script type="text/javascript" src="app/components/bower_components/jquery/jquery.min.js"></script>-->
  <script type="text/javascript" src="app/components/webfonts/js/webfonts.config.js"></script>
  <script type="text/javascript" src="app/components/webfonts/js/webfonts.js"></script>

  
  <!-- Custom javascript -->  
  <script type="text/javascript" src="app/main/js/script.js"></script>
  <script type="text/javascript">
    /* <![CDATA[//> */
    jQuery(document).ready(function($) {
          $('html').removeClass('no-js').addClass('js');
    });
    /* <!]]> */
  </script>
  
  
  <title>HTML base</title>
</head>
<body class="page page-front">
  <?php
	$test = 'site';
	if (isset($_GET['test']))
		$test = basename($_GET['test']);
	include 'tests/'.$test.'.html'; 
  ?>
</body>
</html>