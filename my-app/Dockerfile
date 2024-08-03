FROM public.ecr.aws/docker/library/node:18-alpine3.14 AS development

RUN mkdir /app && chown node:node /app
WORKDIR /app

ENV NODE_ENV development

USER node

COPY --chown=node:node package.json package-lock.json* ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 8081
CMD [ "npm", "run", "dev" ]

