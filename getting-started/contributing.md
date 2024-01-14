---
permalink: /contributing/
group: getting-started
layout: default
title: Contributing
title_short: Contributing
description: How to contribute to KorGE?
priority: 30
fa-icon: fa-code-merge
---

KorGE is an OpenSource Game Engine. It is open to everyone to contribute. There are several ways from doing so: from [contributing to the documentation](https://github.com/korlibs/docs.korge.org) (using git & Obsidian), to [contribute with the engine itself](https://github.com/korlibs/korge), or to create tutorials, [assets, libraries](https://store.korge.org/), examples, or helping people on the [forums](https://forum.korge.org/) or [discord](https://discord.korge.org/).

## Contributing to the engine

You will need Git, Java 17 or greater and IntelliJ IDEA Community or Ultimate.

Start by cloning the repo (or your fork):

```bash
git clone https://github.com/korlibs/korge.git
```

Then open that folder with IntelliJ IDEA.

You can fix stuff or develop new features by using unit tests running them in the IDE. Or via:

```bash
./gradlew jvmTest
```

In the case you need to run a visual application, there is a submodule called `korge-sandbox`, with a main file, where you can perform direct experiments. You can run it with:

```kotlin
./gradlew :korge-sandbox:runJvm
```

You can also publish all the libraries locally with:

```kotlin
./gradlew publishToMavenLocal
```

and then you can use the libraries normally by specifying the version `999.0.0.999`. If you are using the KorGE gradle plugin, it uses mavenLocal first by default. If you are using the libraries standalone, just ensure `mavenLocal()` is defined in the `dependencies { }` block of gradle.

## Contributing to the documentation

You will need: Git, [Obsidian](https://obsidian.md/) or any markdown editor like VSCode or WebStorm.

Fork & clone the <https://github.com/korlibs/docs.korge.org> repository:

```bash
git clone https://github.com/korlibs/docs.korge.org.git
```

Open and edit it with Obsidian or other markdown editor and make a PR.

## Contribute with assets/libraries

TO DO
