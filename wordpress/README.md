# WordPress development

Develop WordPress themes and plugins:

1. Run `docker-compose up` to launch MySQL and WordPress containers (this will take several minutes the first time it's run).
1. Open <http://localhost:8001/> in a browser and install WordPress. Log on to the administration panels as instructed.
1. Add, edit, or remove files in the `wp-content` folder. The `docker-basic` theme can be copied to `wp-content/themes/` and applied in the WordPress **Appearance** menu.
1. Refresh the browser to view changes.

Press `Ctrl|Cmd + C` to stop Docker Compose.
