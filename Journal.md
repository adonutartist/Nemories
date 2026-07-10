# Devlog #1

**Date:** July 7, 2026 2:00 PM to 6:00 PM & July 8, 2026 1::00 AM to 3:00 AM

---

# Overview

Today was all about laying the foundation for Nemories a calming desktop widget where memories are transformed into a growing city. Instead of treating journaling as a list of text entries, every memory becomes a physical part of a world that slowly evolves over time.
The goal is to make personal growth visible. Every memory contributes something to the growing city, turning your memories into a place you can explore.

---

# Initial Concept

The project started with the idea of combining a journal with a city building experience.
Instead of opening a traditional notes app, users are presented with a simple list of memories. Each memory has an associated emotion, and saving a new one gradually expands the world outside the journal.
This creates a visual representation of memories rather than a collection of plain text.

---

# Concept Art

Before writing any code, I sketched the interface and overall vision on paper to explore the layout and user experience.

> <img width="1536" height="2048" alt="image" src="https://github.com/user-attachments/assets/eb6ba17e-597b-4b14-ab0f-9c9a8f709753" />

---

# Journal Interface

One of the biggest changes during development was redesigning the journal workflow.
Instead of opening directly into an editor, the journal now consists of two separate views:

* A memory list
* A memory editor

The experience works like this:

1. Open the journal.
2. If there are no memories, a large "+" button is displayed.
3. Pressing the button opens the editor.
4. Choose an emotion.
5. Write a memory.
6. Save the memory.
7. Return to the list, where the new entry appears automatically.

Each entry is automatically numbered:

* Memory #1
* Memory #2
* Memory #3

Every memory also displays its selected emotion using its own unique color.

---

# Emotion System

Each memory can be assigned one of several emotions:

* Happy    :]
* Excited  xD
* Loving   <3
* Neutral  :|
* Sad     ;-;
* Angry   >:c
* Tired    :p

Each emotion has its own accent color that is used consistently throughout the application.
These colors are also used later when generating buildings inside the world.

---

# Persistent Storage

Memories are saved locally using Local Storage.

This means:

* Closing the application keeps every memory.
* Reopening restores the journal automatically.
* No external database or internet connection is required.
* No data is stolen its all stored on your computer.

---

# Building Generation

The first version of the world generation system has also been implemented.
Every new memory now creates a building.

Current features include:

* Building size scales with memory length.
* Buildings use a shared dark interior.
* Building outlines are colored according to the selected emotion.
* Buildings are linked directly to their corresponding memory.
* Basic overlap prevention keeps new buildings from spawning on top of existing ones.

Although the current layout is temporary, it establishes the core relationship between memories and the world.

---

# World Interaction

Clicking a building immediately opens the journal editor for its associated memory, allowing existing entries to be revisited and edited directly from the world.
Hovering over a building also adds a colored glow using that memory's emotion color, giving subtle visual feedback that buildings can be interacted with.

---

# Visual Improvements

Several interface improvements were added throughout development:

* Redesigned journal layout.
* Dedicated memory list view.
* Separate editor view.
* Improved close buttons.
* Custom scrollbar.
* Pulsing player indicator.
* Colored emotion highlights.
* Hover glow for buildings.
* Cleaner interface.

---

# Current State

At this stage, Nemories already supports the complete journaling loop:

* Create memories.
* Assign emotions.
* Save permanently.
* Automatically generate buildings.
* Reopen memories directly from the world.

The foundation of the application is now complete and ready for expanding the city generation system.

---

# What's Next

The next development milestone focuses on transforming the world into a living city by adding:

* Branching road generation
* Random road expansion
* Draggable camera
* Infinite world growth
* Improved city layouts
* Smarter building placement
* World persistence
* Additional visual polish

These features will allow the city to grow organically over time, making every memory feel like a meaningful contribution to an evolving world.

---

# Current Prototype Images

The current prototype successfully demonstrates the complete concept, connecting journaling with procedural world generation.

> <img width="1920" height="1080" alt="Screenshot (110)" src="https://github.com/user-attachments/assets/ef8c2917-ecf4-44cd-b071-bea91210d922" /><img width="1920" height="1080" alt="Screenshot (115)" src="https://github.com/user-attachments/assets/a0eace82-759a-4744-a317-3ad56b196b0d" /><img width="1920" height="1080" alt="Screenshot (114)" src="https://github.com/user-attachments/assets/afc9ac7d-6e74-4d28-b860-11e68b1e3c5b" /><img width="1920" height="1080" alt="Screenshot (113)" src="https://github.com/user-attachments/assets/6cea6029-40df-443e-a785-278fb78a2744" /><img width="1920" height="1080" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/dd04c457-1aac-4c6c-a66a-cdf9c411e73a" /><img width="1920" height="1080" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/46bdbb93-cbce-4f50-bd1f-40a93159300a" />

---

# Devlog #2

**Date:** July 8, 2026 10:00 PM to July 9, 2026 3:00 AM

---

# Overview

Today I focused on moving beyond isolated building generation and making a true procedural city. The main objective was to make the world itself feel explorable by introducing camera movement, improving building interaction, and starting work on a branching road network capable of supporting long term growth without getting soft locked. This also meant I had to work on making road generation more believable by introducing dedicated building branch roads, collision aware placement, and continuous refinement of the procedural generation logic to support larger cities.

---

# Camera Navigation

Smol but cool, this draggable camera will help players navigate through the city.
Instead of the world remaining fixed around the player, the map can now be freely explored by clicking and dragging.

Additional improvements include:

* Grab cursor while hovering the world.
* Grabbing cursor while dragging.
* Drag threshold to prevent accidental building clicks.
* Smooth camera movement.

This makes navigating larger cities comfortable and lays the groundwork for unlimited world expansion.

---

# Building Interaction Improvements

Buildings now provide additional feedback when explored.

New additions include:

* Hovering over a building displays its corresponding memory number.
* Memory labels appear directly above the selected building.
* Hover effects continue to use each building's emotion color.

This makes locating memories inside larger cities much easier.

---

# Road Network Prototype

Replacing the original single road layout with a procedural branching system.
Instead of every building appearing along one continuous road, the world now generates new road segments by extending from previously created road nodes.

Current work includes:

* Road node data structure.
* Parent and child node relationships.
* Random branch selection.
* Automatic road extension.
* Two-node branch prototype for future expansion.
* Dedicated building branch roads connecting roads directly to buildings.
* Rounded road corners for smoother visual transitions.
* Experimental fading of unfinished road ends to make city expansion appear more natural.

Although still experimental, this is the beginning of a city that can grow naturally in multiple directions rather than following a single linear path.

---

# Building Placement Improvements

Several iterations were spent improving how buildings are positioned relative to roads.

Changes made include:

* Buildings are now generated beside roads rather than directly on them.
* Building placement takes road direction into account.
* Additional overlap handling reduces collisions between neighbouring structures.
* Branch roads automatically extend further when insufficient space is available for larger buildings.
* Branch roads are only created after a valid building position has been found.
* Experimental collision checks prevent branch roads from intersecting existing buildings.
* Ongoing work has begun separating road junctions from building locations to support cleaner road generation.

This architecture will eventually prevent roads from appearing to grow through buildings while allowing the city to expand indefinitely.

---

# World Generation Refinement

The world generation system received several internal improvements while preparing for procedural expansion.

Current improvements include:

* Better branch selection logic.
* Expandable road nodes.
* Improved road growth behaviour.
* Preparation for infinite city generation.
* Foundation for collision aware road placement.
* Dynamic branch length adjustment based on available placement space.
* Refined node reservation system during procedural generation.
* Continued restructuring of road ownership to support more reliable city growth.

These changes are mostly structural but provide a much stronger base for future development.

---

# Bug Fixes

A LAAAAAT of development time was spent resolving issues introduced while transitioning to the new world generation system.

Some of the more significant fixes included:

* Fixed duplicate variable declarations.
* Corrected Local Storage testing workflow.
* Fixed building selection after camera movement.
* Fixed road generation failing after multiple memory placements.
* Corrected building spawning behaviour during branching.
* Improved interaction between dragging and clicking.
* Fixed several building placement inconsistencies.
* Fixed floating buildings caused by large building placement failures.
* Fixed branch roads appearing before successful building placement.
* Reduced overlapping of large buildings through improved placement checks.
* Improved visual continuity between connected road segments.
* Fixed several branch generation edge cases that could interrupt city growth.

Many of these fixes were necessary before continuing work on procedural city generation.

---

# Current State

Nemories has now moved beyond simply storing memories and displaying buildings.

The application now supports:

* Free camera navigation.
* Interactive building labels.
* Experimental branching road generation.
* Dedicated branch roads connecting memories to the city.
* Dynamic building sizing based on memory length.
* Improved building placement.
* A scalable node based world structure.

While the road generation system is still under development ;-; , the project has reached the point where the city can begin evolving into a much more organic and explorable environment.

---

# What's Next

The next milestone will focus on completing the procedural city generation system by adding:

* Smarter branching decisions.
* Collision-aware road generation.
* Reliable building placement.
* World save/load system.
* Decorative objects such as paths, trees and street furniture.
* More natural city layouts.

These additions will allow the world to grow continuously while keeping every memory connected to an organized and believable road network.

---

# Current Prototype Images

The current prototype demonstrates the first iteration of an explorable world with draggable camera controls, interactive buildings, dynamically sized memory buildings, dedicated branch roads, and the latest procedural road generation improvements.

> <img width="1920" height="1080" alt="Screenshot (121)" src="https://github.com/user-attachments/assets/3b72103e-e77b-473f-93de-0fdf2d5d30f9" /><img width="1920" height="1080" alt="Screenshot (123)" src="https://github.com/user-attachments/assets/7a99188b-1927-48d9-8b96-6facd7ced5b6" /><img width="1920" height="1080" alt="Screenshot (122)" src="https://github.com/user-attachments/assets/9f406fb4-d459-47b1-b13f-364bd074184c" />

---

# Devlog #3

**Date:** July 9, 2026 10:00 PM to July 10, 2026 3:15 AM

---

# Overview

Today I worked on turning Nemories from a functional prototype into something that feels much more like a complete desktop application. The largest breakthrough came from finally solving the procedural city generation bottleneck that had been preventing larger cities from growing. After many iterations of debugging road generation, and node expansion, the city can now continue expanding indefinitely without becoming trapped after only 5 memories. Alongside these backend improvements, I also focused on making the application significantly more enjoyable to explore by adding zoom controls, a fixed player marker, and an entirely new statistics window capable of visualising emotional trends using an interactive pie chart.

---

# Infinite City Generation

One of the biggest milestones so far was successfully removing the procedural generation deadlock that caused city growth to stop after only a few buildings.
After restructuring how expandable nodes are selected and how building branches are generated, the city is now capable of continuing to expand as more memories are added.

Major improvements include:

* Successfully removed the previous generation bottleneck.
* Expandable nodes now continue increasing as the city grows.
* Road branches no longer become permanently exhausted after a few memories.
* Improved branch selection logic for future expansion.
* Better handling of node reservation during generation.
* Building branch creation now behaves far more reliably.

This marks the first version of a procedural city that can continuously grow alongside the user's memories.

---

# Camera & World Improvements

Navigation received several upgrades to make exploring larger cities feel much more natural.

New additions include:

* Mouse wheel zooming.
* Smooth zoom in and zoom out.

These additions make the growing city significantly easier to inspect as more memories are created.

---

# Player Marker Improvements

The player marker received a complete behavioural overhaul. Previously, the green marker remained locked to the centre of the screen, making it feel disconnected from the world itself.

This was redesigned so that:

* The player marker now exists as part of the world.
* The marker remains attached to its original spawn location.
* Camera movement no longer drags the player marker across the screen.
* Movement calculations were corrected so the marker remains perfectly aligned with surrounding roads.

This small change doesn't do much but the feeling that the player exists inside the city rather than simply viewing it is better I guess?

---

# Statistics Window

A completely new statistics system was introduced to help visualise emotional trends across stored memories.

New interface additions include:

* Dedicated Statistics button in the title bar.
* Separate Statistics window.
* Emotion distribution pie chart.
* Dynamic legend showing memory totals.
* Automatic colour matching using each emotion's existing colour palette.
* Live updates whenever memories are added.

The statistics window provides an entirely different perspective on the user's journal by displaying emotional balance rather than individual memories.

---

# Interactive Pie Chart

The statistics chart was expanded beyond a simple static graph into an interactive visualisation.

New features include:

* Hover detection for every slice.
* Hovered slices smoothly pop outward.
* Percentage labels appear only while hovering.
* Automatic percentage calculation.
* Percentage text colour changes based on slice brightness for improved readability.
* Small percentage slices display external percentage instead of cramped labels.
* Central counter displaying the total number of Nemories stored.

These interactions make the statistics page feel much more polished while remaining easy to read.

---

# Bug Fixes

A heck ton of time was spent chasing down procedural generation bugs and UI issues.

Some of the larger fixes included:

* Fixed procedural generation stopping after only a few buildings.
* Corrected expandable node selection.
* Fixed branch generation repeatedly selecting invalid nodes.
* Fixed building placement deadlocks.
* Corrected multiple collision detection issues.
* Fixed player marker remaining attached to the camera.
* Resolved player marker movement lag after camera changes.
* Fixed statistics modal not opening.
* Fixed pie chart rendering issues.
* Corrected hover detection inside the chart.
* Fixed percentage labels appearing on incorrect slices.
* Corrected percentage text positioning.
* Improved percentage readability on bright colours.

Many of these fixes required numerous iterations before the systems finally behaved reliably.

---

# Current State

Nemories has turned into a much more complete desktop experience!

The application now supports:

* Continuously expanding procedural cities.
* Dynamic road network generation.
* Reliable building placement.
* Draggable camera controls.
* Mouse wheel zooming.
* Persistent player marker.
* Interactive building labels.
* Emotion based building colours.
* Dynamic building sizes.
* Statistics dashboard.
* Interactive pie chart visualisation.

The project is beginning to feel less like a prototype and more like a living world where every memory permanently contributes to the growth of a unique city.

---

# What's Next

Honestly I don't know what more to add except the widget funtionality...

---

# Current Prototype Images

The latest prototype showcases the first fully expanding procedural city, mouse wheel zoom controls, a world anchored player marker, and the new interactive statistics dashboard featuring a hoverable emotion pie chart.

> <img width="1920" height="1080" alt="Screenshot (124)" src="https://github.com/user-attachments/assets/21453fa3-ad56-47d9-91f9-9067bedbb111" /><img width="1920" height="1080" alt="Screenshot (129)" src="https://github.com/user-attachments/assets/ea3247a7-de1f-43a7-b018-fa1405c9a525" /><img width="1920" height="1080" alt="Screenshot (128)" src="https://github.com/user-attachments/assets/2fcc8b07-b4bc-4416-a021-3359ff79a821" /><img width="1920" height="1080" alt="Screenshot (127)" src="https://github.com/user-attachments/assets/f2e973f4-5ee9-4f95-8426-8f83ab29e47f" /><img width="1920" height="1080" alt="Screenshot (126)" src="https://github.com/user-attachments/assets/335c0e11-45ff-46dd-bc53-c2575a731c52" /><img width="1920" height="1080" alt="Screenshot (125)" src="https://github.com/user-attachments/assets/fadc5525-9706-4162-a4e2-cc8dc6ad3bd9" />

---
