FROM node AS development

WORKDIR /co2_emission

COPY package*.json .

RUN npm install

COPY . .
