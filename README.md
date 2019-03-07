<h1 align="center">
    <img height="500" src="https://user-images.githubusercontent.com/30767528/53894104-c983a800-402f-11e9-80bc-f4d2f7e6bd62.png" alt="Logo">
</h1>

<p align="center">
    <a href="https://vuejs.org/"><img alt="VueJS 2" src="https://img.shields.io/badge/Vue-v2-98b23c.svg"/></a>
    <a href="https://github.com/ambrest/vue-blogfront/tree/master"><img alt="Stable Branch" src="https://img.shields.io/badge/Stable%20Branch-master-3FB27F.svg"/></a>
    <a href="https://github.com/ambrest/vue-blogfront/tree/dev"><img alt="Development Branch" src="https://img.shields.io/badge/Dev%20Branch-dev-3eacb2.svg"/></a>
    <img alt="Product state: Alpha" src="https://img.shields.io/badge/State-Beta-3c71b2.svg"/>
</p>

Vue Blogfront is a blazing fast, standalone PWA blog.
Currently the only backend-solution is the official [vue-blogfront graphql api](https://github.com/ambrest/vue-blogfront) which is a fully-featured GraphQL api. This project is and will always be open source, anybody can contribute to it. The goal is to provide a better, faster and more pleasent blog exprience. The project is currently in the **beta** phase.

## Features
Vue-blogfront has full desktop and mobile support.

All modern browsers like Chrome, Firefox, Opera, Edge and Safari are supported. See [.browserslistrc](/.browserslistrc) for further details.
IE support is and will never be in consideration.

#### Vue Blogfront - unique features
* 100% Offline support (Navigation and searching) - via [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
* Lightweight, only '~ 100kb' js and '~ 30kb' css! (both gzipped).
* Blazing fast with local caching: Average server response time: '~ 100ms' / Client-side rendering time: '~ 1.5s'.
* Installable - [Install it on your desktop and mobile device](https://developers.google.com/web/progressive-web-apps/desktop) (Currently only supported by Chrome 70+ under Linux, Windows and Chrome OS).
* Modern Vue frontend with refreshing design.
* Simple structure and just a few dependencies.
* Easy-to-use admin panel which includes full control over your users.

### Installation
* [Installing on MacOS](/docs/installation/mac.md)
* [Installing on Linux](/docs/installation/linux.md)
* [Installing on Windows](/docs/installation/windows.md)

Check out our [user-friendly installer](https://github.com/ambrest/vue-blogfront)!

#### Production setup
We're currently supporting `CentOS` and `Debian 9 stretch`, you can deploy it using this single command:
```bash
sudo bash <(curl -s0 https://get-blog.ambrest.io/)
```

Or clone [vue-blogfront-installer](https://github.com/ambrest/vue-blogfront-installer) and run it manually;
```bash
sudo bash vue-blogfront.sh
```
