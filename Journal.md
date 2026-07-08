# Devlog #1 — From Idea to First Prototype

**Project:** Nemories

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
