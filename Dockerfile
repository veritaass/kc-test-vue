#FROM node:8.11.4
FROM node:12.18.2
#FROM node:lts-alpine as build-stage
#RUN mkdir /app
WORKDIR /usr/src/app
#WORKDIR /app
COPY package*.json ./
#ENV http_proxy=http://192.168.20.6:3128
#ENV https_proxy=http://192.168.20.6:3128
#ENV http_proxy http://10.250.59.224:3128
#ENV https_proxy http://10.250.59.224:3128
#RUN npm install --production
RUN npm install --location=global --upgrade npm
RUN npm install
RUN npm install vuejs-logger
RUN npm install keycloak-js
#RUN npm install -g @vue/cli
#RUN npm install -g @vue/cli-service
#RUN npm install cross-env


COPY . .
#RUN npm run build

#FROM nginx:stable-alpine as production-stage
#COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8080

#CMD ["npm", "start"] # <<<<<<< We need to change this
#CMD ["npm", "run", "dev"] # <<<<<<< We need to change this
#CMD ["npm", "run", "build"]
CMD ["npm", "run", "dev"]
#CMD ["nginx","-g","daemon off;"]
