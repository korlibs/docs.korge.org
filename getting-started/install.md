---
permalink: /getting-started/install/
group: getting-started
layout: default
title: Install KorGE
title_short: Install
children: /korge/
priority: 10
fa-icon: fa-gamepad
version_review: 2024.1
---

{% include youtube.html video_id="R30yistp-jw" %}

## 1. Install KorGE Forge

KorGE Forge is the IDE for KorGE. You can install it by copy & pasting this command in your OS terminal:

<div>
{% include install_korge_forge.html %}
</div>

You will see something like:

![](/getting-started/korge-forge-installer.png)

Then press the `Install` button, and then the `Open` button. The installer is [OpenSource](https://github.com/korlibs/forge.korge.org/tree/main/src/main/kotlin/korge){:target=_blank}.

## 2. Create a Project

**Install one of the starter kits or samples available using the `New Project...` Wizard:**

You can select one of the `Starter Kits` or one of the `Showcases` with a full game:

![](/i/korge-new-project.avif)

## 3. Access the KorGE Store

In order to access some KorGE features, you can install them via the KorGE Store.

You can access that store via: <https://store.korge.org/>

Or inside the IntelliJ Plugin navigation bar:

![](/i/jitto-korge-store.avif)

Or when opening your `build.gradle.kts` or your `deps.kproject.yml`:

![](/i/jitto-korge-store2.avif)

## 4. Running your code

When creating a new project a new run configuration `runJvmAutoreload` should be available:

![](/i/runJvmAutoreload.avif)

You can also `double click` on the `Gradle` → `Tasks` → `run` → `runJvmAutoreload`
to create a run configuration and execute your program:

![](/i/gradle-panel-runJvmAutoreload.avif)
