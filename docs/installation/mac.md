# Installing on Linux
Vue Blogfront is based on open source technologies which **should** in theory work perfectly well on most of the leading operating systems.
However, I develop the project using Windows machines.

## Requirements

1. Install [LTS version of Node.js for Mac](https://nodejs.org/en/download/)
2. Install [MongoDB for Mac](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
3. You can [download Github Desktop](https://desktop.github.com/) to get access not only for fancy UI but to the git toolset itself.

## Installation of vue-blogfront-api

1. Open the terminal with [Git](https://git-scm.com/download/win) access or use Github desktop
2. Clone the [vue-blogfront-api](https://github.com/ambrest/vue-blogfront-api) project:

```bash
git clone https://github.com/ambrest/vue-blogfront-api
```

3. Go to `vue-blogfront-api` and install dependencies:

```bash
cd vue-blogfront-api
npm install
```

4. Run vue-blogfront-api:

```bash
npm run dev
```

## Installation of vue-blogfront

1. Open your cmdline of choice with [Git](https://git-scm.com/download/mac) access or use Github desktop
2. Clone the [vue-blogfront](https://github.com/ambrest/vue-blogfront) project:

```bash
git clone https://github.com/DivanteLtd/vue-blogfront.git
```

3. Go to `vue-blogfront` directory and install dependencies:

```
cd vue-blogfront
npm install
```

4. Configure `vue-blogfront`  
Since nginx is not used during development there are two properties which need to be changed in [config.json](https://github.com/ambrest/vue-blogfront/blob/master/config/config.json):
```json
"apiEndPoint": "http://localhost:4000/api"
```

5. Run Vue Blogfront Server:

```bash
npm run dev
```

Now you should have Vue Blogfront running on `localhost:3000`.
