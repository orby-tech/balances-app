from node:18-bullseye

run npm install -g npm@9.6.3

RUN git clone https://github.com/orby-tech/balances-app.git

RUN cd balances-app && git pull

RUN cd balances-app/backend && npm install && npm run build

RUN cd balances-app/frontend && npm install && npm run build

RUN cd balances-app/backend

RUN cd balances-app/frontend

CMD cd balances-app/backend && node dist/backend/src/main.js 