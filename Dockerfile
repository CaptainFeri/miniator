FROM node
WORKDIR /app
COPY app/pakage*.json ./
COPY ./app .
ENV TZ="Asia/Tehran"
RUN npm run build
CMD npm run start