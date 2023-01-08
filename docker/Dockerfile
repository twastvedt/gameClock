FROM node:16-alpine AS vue

RUN mkdir -p /app
WORKDIR /app

COPY package*.json tsconfig*.json .npmrc ./ 
COPY projects/client/package.json projects/client/
COPY projects/common/package.json projects/common/

RUN npm ci

COPY projects/common projects/common/
COPY projects/client projects/client/

ENV NODE_ENV=production

ARG GIT_SHA
ENV GIT_SHA=${GIT_SHA}

RUN npx -w projects/common tsc -b && npm run -w projects/client build


FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY projects/server/package.json projects/server/
COPY projects/common/package.json projects/common/

RUN npm ci

COPY . .

RUN rm -rf projects/client && npx -w projects/common tsc -b

COPY --from=vue /app/projects/server/clientBuild projects/server/clientBuild

EXPOSE 8080

CMD ["npm", "start"]
