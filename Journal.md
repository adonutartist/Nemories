# Devlog #1

**Date:** July 7, 2026 2:00 PM to 6:00 PM & July 8, 2026 1::00 AM to 3:00 AM

---

# Overview

Today I just focused on the concept and getting my idea down without scopekreeping :p
The goal of Nemories is to make your memories something meaningful & visible. Every memory contributes a building to the growing city, turning your memories into a place you can explore.

---

# Concept Art

Before writing any code, I sketched the interface and overall vision on paper to have a clear goal and not divert from the original concept that I usually tend to do ;-;

> <img width="1536" height="2048" alt="image" src="https://github.com/user-attachments/assets/eb6ba17e-597b-4b14-ab0f-9c9a8f709753" />

---

# Journal Interface

The Journal or Notes windoow consists of two separate fields:

* A memory list
* A memory text box

The workflow is like this:

1. Open the journal/notes.
2. If there are no memories, a large "+" button is displayed.
3. Pressing the button opens the editor.
4. Choose an emotion.
5. Write a memory.
6. Save the memory.
7. Return to the list, and u will find the new entry appears automatically.

Each entry is also automatically numbered like this:

* Memory #1
* Memory #2
* Memory #3

Every memory also displays its selected emotion using its own unique color.

---

# Emotion System

Each memory can be assigned one of the 7 emotions:

* Happy     :]
* Excited   xD
* Loving    <3
* Neutral   :|
* Sad       ;-;
* Angry     >:c
* Tired     :p

Each emotion has its own accent color that is used consistently throughout the application.
These colors will also be used later when generating buildings inside the world.

---

# Persistent Storage

Memories are saved locally using Local Storage.

This means:

* Closing the application keeps every memory.
* Reopening restores the journal automatically.
* No internet connection required.
* No personal data is stolen its all stored on your computer.

---

# Building Generation

A prototypeishh not truly procedural world generation system has also been implemented.
Every new memory now creates a building.

Current features include:

* Building size is determined by the length of your memory.
* Buildings use a dark interior similar to the background.
* Building outlines are colored according to the selected emotion.
* Buildings are linked directly to their corresponding memory.
* Basic overlap prevention keeps new buildings from spawning on top of existing ones.

---

# World Interaction

Clicking a building immediately opens the memory editor for its associated memory, allowing existing memories to be revisited and also edited directly from the world.
Hovering over a building also adds a colored glow using that same memory's emotion color, giving subtle visual feedback that buildings can be clicked.

---

# What is Next

Next day I will focus on making:

* Branching road generation
* Random road expansion
* Draggable camera
* Infinite world growth

---

# Current Prototype Images

> <img width="1920" height="1080" alt="Screenshot (110)" src="https://github.com/user-attachments/assets/ef8c2917-ecf4-44cd-b071-bea91210d922" /><img width="1920" height="1080" alt="Screenshot (115)" src="https://github.com/user-attachments/assets/a0eace82-759a-4744-a317-3ad56b196b0d" /><img width="1920" height="1080" alt="Screenshot (114)" src="https://github.com/user-attachments/assets/afc9ac7d-6e74-4d28-b860-11e68b1e3c5b" /><img width="1920" height="1080" alt="Screenshot (113)" src="https://github.com/user-attachments/assets/6cea6029-40df-443e-a785-278fb78a2744" /><img width="1920" height="1080" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/dd04c457-1aac-4c6c-a66a-cdf9c411e73a" /><img width="1920" height="1080" alt="Screenshot (111)" src="https://github.com/user-attachments/assets/46bdbb93-cbce-4f50-bd1f-40a93159300a" />

---

# Devlog #2

**Date:** July 8, 2026 10:00 PM to July 9, 2026 3:00 AM

---

# Overview

Today I focused on making a true procedural generation for both buildings and roads. I also added camera dragging.

---

# Camera Navigation

Smol but cool, this draggable camera will help users navigate through the city.
Instead of the world remaining fixed around the player, the map can now be freely explored by dragging.

Additional improvements include:

* Grab cursor while hovering the world.
* Grabbing cursor while dragging.
* Drag threshold to prevent accidental building clicks.
* Smooth camera movement.

---

# Building Interaction Improvements

Buildings now provide additional info when hovered.

New additions include:

* Hovering over a building displays its corresponding memory number.
* Memory labels appear directly above the selected building.
* Hover effects continue to use each building's emotion color.

---

# Road Network Prototype

Replacing the original single road layout with a procedural branching system.
Instead of every building appearing along one continuous road, the world now generates new road segments by extending from previously created road nodes.

Current work includes:

* Road node data structure.
* Parent and child node relationships.
* Random branch selection.
* Automatic road extension.
* Double node branch for easy expansion.
* Dedicated building branch roads connecting roads directly to buildings.
* Rounded road corners for smoother visual transitions.
* Fading of open road ends to make city expansion appear more natural.

---

# Building Placement Improvements

Also made improvements on how buildings are positioned relative to roads.

Changes made include:

* Buildings are now generated beside roads rather than directly on them.
* Building placement takes road direction into account.
* Branch roads automatically extend to the second node when insufficient space is available for larger buildings.
* Branch roads are only created after a valid building position has been found.

---

# What's Next

Next day I will focus on completing the procedural city generation system by adding:

* Building & road save/load system.
* Debugging several bugs in the procedural generation.

---

# Current Prototype Images

> <img width="1920" height="1080" alt="Screenshot (121)" src="https://github.com/user-attachments/assets/3b72103e-e77b-473f-93de-0fdf2d5d30f9" /><img width="1920" height="1080" alt="Screenshot (123)" src="https://github.com/user-attachments/assets/7a99188b-1927-48d9-8b96-6facd7ced5b6" /><img width="1920" height="1080" alt="Screenshot (122)" src="https://github.com/user-attachments/assets/9f406fb4-d459-47b1-b13f-364bd074184c" />

---

# Devlog #3

**Date:** July 9, 2026 10:00 PM to July 10, 2026 3:15 AM

---

# Overview

Today I spent most of my time bugfixing because I have never done a procedural system in pure javascript and also couldn't find any good tutorials. After what felt like ages I was able to solve the bug that capped building generation at only 5 buildings.

---

# Camera & World Improvements

Navigation received zoom feature to make exploring larger cities feel much more easier.

New additions include:

* Mouse wheel zooming.
* Smooth zoom in and zoom out.

---

# Player Marker Improvements

The player marker received a complete overhaul. Previously, the green marker remained locked to the centre of the screen which meant like if I dragged away then it would still be the center of my screen which looked really really disconnected.

Here is what I did:

* The player marker now exists as part of the world and not as a part of the user's screen.
* The marker remains attached to its original spawn location.
* Camera movement no longer drags the player marker across the screen.
* Movement calculations were corrected so the marker remains perfectly aligned with surrounding roads.

---

# Statistics Window

Introduced a new window called stats to help visualise emotional trends across stored memories.

New additions include:

* Dedicated Stats button in the title bar.
* Separate Stats window.
* Emotion distribution pie chart.
* Legend showing memory totals.
* Automatic colour matching using each emotion's existing colour palette.
* Live updates whenever memories are added.

---

# Interactive Pie Chart

Made the pie chart more interactive.

New features include:

* Hover detection for every slice.
* Hovered slices smoothly pop outward.
* Percentage labels appear only while hovering.
* Automatic percentage calculation.
* Percentage text colour changes based on slice brightness for improved readability.
* Small percentage slices display external percentage instead of cramping labels in thin slices.
* Central circle cutout displaying the total number of Nemories stored.

These interactions make the statistics page feel much more polished while remaining easy to read.

---

# What's Next

Honestly I don't know what more to add except the widget funtionality...

---

# Current Prototype Images

> <img width="1920" height="1080" alt="Screenshot (124)" src="https://github.com/user-attachments/assets/21453fa3-ad56-47d9-91f9-9067bedbb111" /><img width="1920" height="1080" alt="Screenshot (129)" src="https://github.com/user-attachments/assets/ea3247a7-de1f-43a7-b018-fa1405c9a525" /><img width="1920" height="1080" alt="Screenshot (128)" src="https://github.com/user-attachments/assets/2fcc8b07-b4bc-4416-a021-3359ff79a821" /><img width="1920" height="1080" alt="Screenshot (127)" src="https://github.com/user-attachments/assets/f2e973f4-5ee9-4f95-8426-8f83ab29e47f" /><img width="1920" height="1080" alt="Screenshot (126)" src="https://github.com/user-attachments/assets/335c0e11-45ff-46dd-bc53-c2575a731c52" /><img width="1920" height="1080" alt="Screenshot (125)" src="https://github.com/user-attachments/assets/fadc5525-9706-4162-a4e2-cc8dc6ad3bd9" />

---

# Devlog #4

**Date:** July 10, 2026 10:00 PM to July 11, 2026 3:00 AM

---

# Overview

Today the biggest addition was the introduction of the first desktop widget prototype. Alongside this, I expanded the analytics system with a completely new mood history graph, improved memory editing behaviour, and began experimenting with allowing the player to physically explore the city using keyboard movement.

---

# Desktop Widget Prototype

Added a super lightweight version of the piechart as a widget window

Current functionality includes:

* Add Nemory Stats as Widget option.
* Widget launches as a separate Electron window.
* Frameless floating desktop widget.
* Always on top of your screen.
* Hidden from the taskbar.
* Dedicated close button.
* Custom draggable title bar.
* Automatic reopening prevention if already running.

---

# Widget Pie Chart

The widget was basically a lightweight copy of the pie chart from the stats window.

New additions include:

* Standalone emotion distribution pie chart.
* Shared emotion colour palette with the main application.
* Glowing chart styling.
* Percentage labels inside larger slices.
* Automatic text colour adjustment for readability.
* Central Nemory counter.
* Live update with the application's saved data.

---

# Mood Graph

The statistics dashboard was expanded with a completely new visualisation designed to show how emotions evolve over time rather than simply displaying their overall distribution.

Current implementation includes:

* Daily mood history generation.
* Emotion scoring system.
* Automatic daily mood averaging.
* Timeline graph visualisation.
* Interactive graph points.
* Hover detection.
* Date display.
* Daily memory count.
* Larger window for improved readability.

---

# Memory Editing Improvements

Editing existing memories now updates every connected system rather than only changing the notes text.

New behaviour includes:

* Building colours automatically update after emotion changes.
* Statistics instantly refresh.
* Mood graph refreshes automatically.
* Widget reflects updated emotional data.
* Save file updates immediately after editing.

---

# About Window

A brand new About section was added to give all my info like github repo link etc.

Current additions include:

* Clickable Nemories button.
* Dedicated About window.
* Project information.
* Direct GitHub repository button.
* Improved formatting and layout.

---

# Player Movement Prototype

Also worked on allowing the player marker to become an actual controllable character rather than simply acting as a static indicator because this would be really cool exploring the town/city you have built.

Experimental work includes:

* Keyboard movement using WASD.
* Restricting movement to roads.
* Collision testing with straight and bent road segments.
* Improved movement calculations.

---

# What's Next

Next day I will focus on completing player movement and adding pigeons.

Planned work includes:

* Finalising player movement.
* Reliable road collision.
* Camera following the player.
* Memory streak system.
* World decorations such as trees, benches and street lights.

---

# Current Prototype Images

> <img width="1920" height="1080" alt="Screenshot (130)" src="https://github.com/user-attachments/assets/97aeb260-c8f4-4781-b481-60d977536cbd" /><img width="1920" height="1080" alt="Screenshot (134)" src="https://github.com/user-attachments/assets/54d8fa8d-ef66-4eda-8037-26f88ecfb72a" /><img width="1920" height="1080" alt="Screenshot (135)" src="https://github.com/user-attachments/assets/771435d0-30d8-4759-b32e-2423ccc171c8" /><img width="1920" height="1080" alt="Screenshot (133)" src="https://github.com/user-attachments/assets/cd8e3f89-e539-4780-b3b6-1623634e9d85" /><img width="1920" height="1080" alt="Screenshot (132)" src="https://github.com/user-attachments/assets/88d11db6-1b0b-4d6c-aba4-603d01d9be1f" />

---

# Devlog #5

**Date:** July 11, 2026 11:30 PM to July 12, 2026 3:00 AM

---

# Overview

Today I tried to make some random interactive features like hover on bird packs, grass, wind many failed stuff. I spent a large portion of the session improving player movement, implementing camera behaviour, experimenting with environmental effects such as animated grass and wind, and beginning work on ambient wildlife that will eventually populate the city. While many of these systems are still prototypes and I ended up deleting many, but they kinda establish the foundation for transforming Nemories into something that feels like a living miniature world rather than a static procedural map.

---

# Camera Improvements

After introducing player movement in the previous build, navigation received another major improvement through a new camera follow system.

New additions include:

* Automatic camera follow mode.
* Smooth camera interpolation.
* Free camera exploration using mouse dragging.
* Automatic switch between follow mode and free camera.
* Camera instantly returns to the player when movement resumes.
* Improved exploration workflow.

Rather than permanently locking the camera to the player, users are now free to explore the city before instantly returning to their current position simply by moving again.

---

# Improved World Interaction

Several improvements were made to make interacting with the city feel much more responsive.

Current improvements include:

* Corrected hover calculations after camera zoom.
* Improved world coordinate conversion.

These changes will help reduced the inconsistencies that appeared while navigating larger cities.

---

# Dynamic Grass Prototype

Work began on replacing the previously empty background with a much more natural environment but I straight up failed like insane...

Implementation included:

* Procedurally generated grass blades.
* Large grassy landscape surrounding the city.
* Automatic avoidance around roads.
* Automatic avoidance around buildings.
* Grass generation restricted to valid terrain only.

But the end result kinda look trash so here we are with our usual black background ;-;

---

# Wind Simulation

I tried adding wind for grass blade movement But it all looked trash.

Changes included:

* Travelling wind wave.
* Grass sway animation.
* Wind direction.
* Wind strength.
* Procedural wave propagation.
* Automatic wind timing.

But deleted it cuz visually looks bad

---

# Ambient Wildlife Prototype

This is the one feature I did correctly well it looks bad ngl.

Current work includes:

* First pigeon sprite integration.
* Animated idle state.
* Animated feeding behaviour.
* Animated flying behaviour.
* Procedural spawning near buildings.
* Hover based scare behaviour.
* Initial flock generation system.

I don't know how to implement crisp pixel sprites it all looks blurry right now. Can't use the usual css image rendering pixelated cuz I am making them in ctx.

---

# Current State

Nemories has started transitioning from a procedural journal into something that feels much more alive.

The application now supports:

* Infinite procedural city generation.
* Persistent world saving.
* Interactive statistics dashboard.
* Desktop statistics widget.
* Mood timeline visualisation.
* Camera follow mode.
* Free camera exploration.
* Keyboard player movement.
* Procedural grass generation.
* Animated wind effects.
* Ambient pigeon prototype.
* Interactive About page.
* Live building colour updates.
* Responsive hover sound effects.

---

# What's Next

The next milestone will focus on bringing even more life into the city.

Planned work includes:

* Finalising pigeon AI.
* Birds flying in from off-screen and naturally landing.
* Improved flock behaviour.
* Street lamps.
* Benches and decorative props.
* Trees and flowers.
* Memory streak system.
* Additional desktop widgets.
* More ambient wildlife such as butterflies.

---

# Current Prototype Images

The latest prototype showcases the new player camera system, procedural grass generation, animated wind prototype, improved analytics interface, and the first implementation of ambient wildlife beginning to inhabit the growing city.

> <img width="1920" height="1080" alt="Screenshot (137)" src="https://github.com/user-attachments/assets/ca4961a7-b9c7-4283-93e4-fa43005bf778" /><img width="1920" height="1080" alt="Screenshot (136)" src="https://github.com/user-attachments/assets/7e10619a-8bed-40a7-beed-b2efc2d0191a" />

---

# Ending Devlog

Fireflies, Pigeons added and so Version 1.0.0 done!
cyaaaa!
