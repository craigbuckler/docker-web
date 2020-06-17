<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<title><?php bloginfo('name'); ?></title>
<link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">
<?php wp_head(); ?>
</head>
<body>

  <header>
    <h1><?php bloginfo('name'); ?></h1>
    <p><?php bloginfo('description'); ?></p>
  </header>

  <main>
    <?php
      if ( have_posts() ) : while ( have_posts() ): the_post(); ?>

      <article id="post-<?php the_ID(); ?>">
        <h2><?php the_title(); ?></h2>
        <?php the_excerpt(); ?>
      </article>

    <?php
      endwhile;
    endif;
    ?>
  </main>

  <?php wp_footer(); ?>
</body>
</html>
