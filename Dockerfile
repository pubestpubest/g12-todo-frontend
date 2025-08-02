FROM node:24-alpine AS builder

RUN corepack enable

WORKDIR /app

COPY . .

RUN pnpm install

RUN pnpm run build

FROM nginx:alpine as runner

COPY ./nginx.conf /etc/nginx/templates/nginx.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html