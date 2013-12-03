---
layout: article
title: Getting used to Git
excerpt: How I got started using Git and the concepts that helped me to get Git into my every day process.
---

I didn’t think I needed [Git](http://git-scm.com/) because for a long time I was the only developer at our studio. I had my processes in place. I made a copy of a file before I edited it (usually). I had software to compare versions. And no one else ever needed to work on my code at the same time as me.

But I always felt a little unprofessional. Everyone was talking about version control and how important it is.

So I installed it. I opened Terminal, with a command line cheat sheet up and trudged along until I had a repo with a readme file.

## But I still didn’t really Git it

It seemed like it would add 20% to my regular process and I wasn’t used to the command line. I had to get up the cheat sheet or google how to do the most basic things. I know repetition is the key to learning but I didn’t have the time.

I decided to start on personal projects outside of work. I found a GUI I liked ([Tower](http://www.git-tower.com)) which really helped to get the fundamental understanding down. I started to see some value; I didn’t have a dozen duplicate files I had to organise for one. It didn’t take too much time to commit and leave a note. Git was OK.

## Until I had no choice.

I had to collaborate with another developer on a project! I admitted up front I was still learning Git. I asked before every push to make sure I wouldn’t break anything. My collaborator was very kind and assuring. 
But I got it now! Everything is recoverable, files can merge together with minimal effort. Changes can be stashed away for later. Everything was organised, dated and annotated. It was beautiful!

Now I Git every day :) 
I Git this website.
I Git modules and themes.
I make patches and submit them to other module developers.

Before Git I **used** Open Source software, but I wasn’t Open Source. I couldn’t create a patch or fork a repo. I couldn’t contribute. 

So if you want to Git started, hopefully this can help:

## The language:

### Repo/repository
A repository is a folder that git tracks the changes of. 
There’s a local repo (on your computer) and a remote repo (on something like github.com). 

### Pull
Grab the latest version from the remote repository.

### Push
Send my local changes to the remote repository.

### Stage
Designate a portion of code that is ready to be commited.
You can break up your changes into logical commits or commit them all at once.

### Commit
A saved snapshot of the file, commit’s never get deleted, you can revert or roll back to them at any time.

### Stash
Set aside my changes while I try something else.

### Diff
The difference between the previous version of the file and the new version. A patch is just all the diff’s in a file.

## The basic process
1. Initialise local repo, on your desktop
2. Add remote repo
3. Add files
4. Commit initial files
5. Change files
6. Commit changes
7. When finished commiting the days changes, push to remote repo
8. Sleep
9. Next morning, on your laptop, clone the remote repo
10. Make changes
11. Commit changes
12. When finished commiting the days changes, push to remote repo
13. Sleep
14. Next morning, back on the desktop, pull from the remote repo
15. Make changes
16. Commit changes
17. Now your collaborator clones the remote repo
18. They make a branch to work from
19. They make changes and you make changes (communicating with each other ideally) at the same time, even to the same files
20. Both your changes get pushed to the remote repo
21. When your collaborator is finished they merge their branch back into the master branch like magic! 
22. Git is your new best friend :)