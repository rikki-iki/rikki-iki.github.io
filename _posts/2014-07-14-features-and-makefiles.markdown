---
layout: article
title: Reproducing Drupal
excerpt: Basic guide for getting started with Features (and Drush Make files and Install profiles if you're feeling adventurous)
---

I'll start by saying you don't have to start from scratch with these. There's a heap of Distributions up on drupal.org that you can download, play with, alter and make your own. Take from a couple of them. It's quite fun seeing certain modules that other people have used and learning what they do.

## The ultimate purpose

To stop repeating yourself. I have certain things that I do on every Drupal site I setup, but streamlining them into a few flexible things you can then drop into every new site you do and have all that work instantly done for you. It's just the best. And it's not that hard to do either.

## Features

I'm an absolute clicker. I click all the buttons in Drupal to get what I need setup, I certainly don't know how to create a content type with just code! And there's no need to with Features. You can do all the clicking then let Features export it all into code.

Why does it help to be in code? If it's stored in the database it's much harder to grab out that one content type you wanted and apply it to a new site. If it's in a Feature you can install that specific content type, and all the other bits that goes with it into almost any Drupal site.

### What do my features look like...

A config feature that has image styles, site information, text formats.. really general things.
A standard page content type with basic fields.
A blog post content type, blog index view and blog category taxonomy.
A slideshow content type and view.
A contact page content type with contact form fields and email notifications.

5 simple Features that setup the basics of most content based websites or blogs. I can easily swap and change as well, if they don't want a slideshow (thank god) I just don't install it.

Create a couple, install them on you're next project, refine them. They should be flexible. Tailor them once they've been installed for that projects specific needs. Don't try to make them everything for everyone. It'll work out just as much work if you're clicking around deleting bits of them then creating them from scratch.

I recommend using [Strongarm](https://www.drupal.org/project/strongarm) with [Features](https://www.drupal.org/project/features) to get other site settings like pathauto patterns and the frontpage path.

## Drush make files

If you're not a drush user then that's ok. I do recommend looking at it at some point but everything in good time. 

A Drush make file is a file that lists of the modules and themes that you regularly install on a site. There's a bit of formatting required to make the file readable to Drush but when it's done you can point Drush to the file and say MAKE! Then Drush will download for you Drupal and all of the listed modules and themes in one hit. 

You can even point to your features, if you've got them hosted online, and Drush will grab them too. So with a little setup you have all the files needed for your basic install. The same principle applies as with Features, that you want your make file to be flexible.

## Install profiles

The last piece is an install profile. Similar to a drush make file, the install profile lists all the modules that you want to be enabled when installing Drupal. Including your features. So you can skip the module page all together, and let Drupal do the setup while you sit back with a coffee.

Obviously this is a simplified version of what's really happening but it's certainly worth a little bit of your time to look into. It will save you so much time in the long run!! I cut down my site installation time to 12 seconds :)

Now I started by playing around with [Profile Builder](https://www.drupal.org/project/profiler_builder), there's also [Feature Builder](https://www.drupal.org/project/features_builder) which I haven't used. Features are easy enough to do on your own.

Set yourself up a side project and have a go.
