# TiTemplates

TiTemplates is a collection of Titanium Application Templates that can be invoked from the CLI at project creation.

## Reasoning
With the Titanium CLI you can specify a template name using the --template argument. By default the CLI is using a template called "default".  Templates are stored in your Titanium SDK folder, under templates/apps.

This repo is:

1. A collection of curated, semi-official Titanium templates
2. A node.js script that will automatically download the templates and install them in the proper sdk folder. Note: Requires Titanium CLI >= 3.2

After running the script, the user should be able to create a new project with the specified template, for example:

     ti create --template xplatform_tabs
     ti create --template android_action_bar
     ti create --template xplatform_nav
     
## Notes
Since templates are stored inside the actual SDK folder, this means that you'll have to re-run the command every time you update to a newer SDK.
     
## Collaborators
Always welcomed

## License
MIT: [alco.mit-license.org](alco.mit-license.org)