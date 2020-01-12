FROM node:10 as node

WORKDIR /usr/client

COPY package*.json /usr/client/

RUN npm install

COPY . /usr/client/

RUN npm run build

FROM nginx:1.16.0-alpine

COPY --from=node /usr/client/dist/client /usr/share/nginx/html
COPY --from=node /usr/client/nginx.conf /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'

# CMD ["nginx", "-g", "daemon off;"]
