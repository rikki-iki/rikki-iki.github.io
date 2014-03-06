---
layout: article
title: Fav accessibility bits
excerpt: Some of my favourite articles and tools for making the web more accessible
---

Accessibility is something I believe in, and have been studying from a distance for a while. I’d love to be able to get some external testing done one day to see if I’m on the right track.

## Accessible design

I check all typography in a design using this amazing [colour contrast calculator](http://leaverou.github.io/contrast-ratio). It tells you if a colour combination passes WCAG 2.0 A, AA or AAA for based on the font size and even opacity. Super handy.

Dichomatic colour blindness can be tested for in Photoshop. Under View > Proof Setup you’ll see two options for the two main  types (Protanopia & Deuteranopia).

Monochromatic colour blindness can also be tested in Photoshop simply by setting the Image > Mode to Greyscale. The contrast test above will point out similar issues but it’s useful to be able to see for yourself.

If you’re already working in the browser you could try the [Colorblind Web Page Filter](http://colorfilter.wickline.org/) or from the Mac App Store try [Sim Daltonism](http://michelf.ca/projects/sim-daltonism/).

Using colour as the only means to communicate something can also present a lot of problems as explained in this article on [colour accessibility](http://t.co/T6Adjdn0).

## No CSS

A really simple test is to turn off your CSS and Javascript. If you’re page reads/flows well and makes sense, you’re doing ok. This is how a screen reader reads your website, assisted (sometimes) by helpful markup.

This article gives great insight into this: [“things I learned from pretending to be blind for a week”](http://t.co/PYL1kIe8)

HTML5 and WAI ARIA go a long way for making the different sections of a web page more meaningful to the non-human things that also have to read them, like screen readers. There’s a lot of easy to digest information about them both on [The Paciello Groups blog](http://blog.paciellogroup.com/)

## Maybe they just prefer the keyboard...

Maybe the battery in their wireless mouse just ran out and they just want to know what was on the next page! Providing more than 1 means of navigating your site is also important. You don’t know what the circumstances are. 

Making your second level dropdown or flyout menu items keyboard navigable is made easy with [Superfish](http://users.tpg.com.au/j_birch/plugins/superfish/), though I’ve been looking at this, more lightweight alternative [Dropdown Menu Test](http://staff.washington.edu/tft/tests/menus/simplyaccessible/index.html)

## General resources

* [Simply Accessible](http://simplyaccessible.com/archives/)
* [The Paciello Groups blog](http://blog.paciellogroup.com/)
* [456bereastreet.com](http://www.456bereastreet.com/)
