# Example quiz project

This project creates a browser-based general knowledge quiz application.


## Container overview

Three containers are connected to a `quiznet` Docker network:

1. MongoDB database (`mongodb`, port `27017`)

   A collection named `quiz` is created in the `quiz` database for question data storage.

1. Node.js application (`nodejs`, port `8000`)

   `index.js` launches an Express.js application which fetches, formats, and stores questions from the [Open Trivia Database API](https://opentdb.com/) on start-up. A single `/question` endpoint returns the next question.

   npm scripts build the client-side HTML, CSS, and JavaScript of the quiz application. Source files contained in the `src` directory are output to a `static` directory (Docker volume) using [pug templates](https://pugjs.org/), [PostCSS](https://postcss.org/), and [Rollup.js](https://rollupjs.org/).

1. NGINX reverse proxy (`nginx`, port `80`)

   This serves client-side files from the shared `static` volume and forwards other requests to the `nodejs` application.


## Launch in development mode

Launch the quiz in development mode with auto-building, source maps, and application restarts using the `docker-compose.yml` configuration in the `./quiz` project root:

```sh
cd quiz
docker-compose up
```

Access the application via NGINX at <http://localhost:8080/>

Additionally, you can access:

* the Node.js application directly at <http://localhost:8000/>
* the Node.js debugger at <http://localhost:9229/>
* the `quiz` database using a MongoDB client by connecting to <http://localhost:27017/> with the user ID `quizuser` and password `quizpass`.


## Launch in production mode

Each `Dockerfile` builds a production image. These can be launched without modification using the `docker-compose-production.yml` configuration in the `./quiz` project root:

```sh
cd quiz
docker-compose -f ./docker-compose-production.yml up
```

Append `-d` to run the quiz as a background process.

Access the application via NGINX at <http://localhost:8080/>

Direct access to other containers is not permitted.


## Clean up

To stop the quiz application, press `Ctrl|Cmd + C` or enter `docker-compose down` in another terminal (`cd` to the same directory).

The application's Docker containers, images, volumes, and networks can be removed with:

```sh
docker-compose rm
docker volume prune -f
docker image rm quiz_nodejs quiz_nginx
```

Alternatively, you can wipe all Docker data including base images:

```sh
docker system prune -af --volumes
```
