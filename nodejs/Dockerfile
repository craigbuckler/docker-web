# base Node.js LTS image
FROM node:lts-alpine

# define environment variables
ENV HOME=/home/node/app
ENV NODE_ENV=production
ENV NODE_PORT=3000

# create application folder and assign rights to the node user
RUN mkdir -p $HOME && chown -R node:node $HOME

# set the working directory
WORKDIR $HOME

# set the active user
USER node

# copy package.json from the host
COPY --chown=node:node package.json $HOME/

# install application modules
RUN npm install && npm cache clean --force

# copy remaining files
COPY --chown=node:node . .

# expose port on the host
EXPOSE $NODE_PORT

# application launch command
CMD [ "node", "./index.js" ]
