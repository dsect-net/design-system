# Build context is the repository root. The kit imports the CSS and @dsect/ui source beside it.
FROM node:22-alpine AS build
WORKDIR /src
COPY fonts.css tokens.css base.css components.css ./
COPY fonts ./fonts
COPY untitled ./untitled
COPY react ./react
COPY kit ./kit
WORKDIR /src/kit
RUN npm ci --no-audit --no-fund && npm run build

FROM nginx:1.27-alpine
COPY kit/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/kit/dist /usr/share/nginx/html
EXPOSE 80
