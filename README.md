# TiTemplates

TiTemplates is a collection of Titanium Application Templates that can be invoked at project creation.

## Reasoning
Titanium Studio has some built-in templates.  However, the CLI also has a mechanism for creating a new project based on a template.

By using the --template tag, you can specify a template name, by default the CLI is using a template called "default".

Templates are stored in your Titanium SDK folder, under templates/apps.

This repo is:

1. A collection of curated, semi-official Titanium templates
2. A node.js script that will automatically download the templates and install them in the proper sdk folder. Note: Requires Titanium CLI >= 3.2

After running the script, the user should be able to create a new project with the specified template, for example:

     ti create --template tabs
     ti create --template android_action_bar
     ti create --template xplatform_nav
     
## Collaborators
Always welcomed

## License
MIT: [alco.mit-license.org](alco.mit-license.org)