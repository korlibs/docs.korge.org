---
permalink: /infrastructure/
group: about
layout: default
title: Infrastructure
fa-icon: fa-question-circle
priority: 2000
---

## Infrastructure, Deployment and Publishing

In this document we will explain all the infrastructure of the KorGE ecosystem including how to deploy the artifacts.

## Engine and Korlibs

KorGE is divided into multiple libraries (korlibs), being KorGE the latest one. They are published into maven central.

Publishing the libraries is just a matter of creating a new release at github with a proper branch starting with `v`. For example `v6.0.0` <https://github.com/korlibs/korge/releases/tag/v6.0.0>

## id.korge.org, version.korge.org, korge.org, blog.korge.org

While that page is private, admins of the team should have access: <https://github.com/korlibs/id.korge.org>
Each commit to the main branch will perform a deploy.

These pages are deployed to Cloudflare Pages.

## docs.korge.org

<https://github.com/korlibs/docs.korge.org>

Each commit here will deploy the page to Github pages and available at docs.korge.org

## store.korge.org

Here's where all the libraries and assets are published. Source code is here <https://github.com/korlibs/store.korge.org>
They are provided as jekyll pages.

Library examples:
* <https://github.com/korlibs/korge-k3d>
* <https://github.com/korlibs/korge-ext>

Usually a library has an example project in the root, then one or more modules that have a `kproject.yml` file inside, then in the example root folder, there is a `deps.kproject.yml` referencing the folder-based modules.

These libraries are used in source form directly. They are referenced typically in the `deps.kproject.yml` in KorGE projects via URL and version.
To publish new versions, just create a tag with the version.

To update all the versions in the store (newly created tags in existing repos), you can manually trigger this workflow: <https://github.com/korlibs/store.korge.org/actions/workflows/updateall.yml> (this will download all the repos, search for tags, dates and associated KorGE versions and redeploy the store static files)

## IDE (KorGE Forge) forge.korge.org

* KorGE Forge Installer: <https://github.com/korlibs/forge.korge.org> available in each commit to forge.korge.org
* IntelliJ Plugin: <https://github.com/korlibs/korge-forge-plugin>
* IntelliJ Fork: <https://github.com/korlibs/intellij-community/tree/forge/2024.2.0.2>
