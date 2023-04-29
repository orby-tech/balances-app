from node:18-bullseye

run npm install -g npm@9.6.3

RUN git clone https://github.com/orby-tech/balances-app.git

RUN cd balances-app && cd backend && npm install && cd ./../frontend && npm install

RUN cd balances-app && npm run build

CMD cd balances-app/backend && node dist/backend/src/main.js 