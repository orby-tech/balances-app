scp -r docker-compose.yml root@31.192.235.64:./manager/docker-compose.yml
scp -r ./container/Dockerfile root@31.192.235.64:./manager/container/Dockerfile
scp -r ./frontend/dist/* root@31.192.235.64:./manager/frontend/dist/
scp -r ./backend/dist/* root@31.192.235.64:./manager/backend/dist/
scp -r ./backend/package.json root@31.192.235.64:./manager/backend/package.json
scp -r ./backend/src/* root@31.192.235.64:./manager/backend/src/
scp ./backend/views/index.hbs root@31.192.235.64:./manager/backend/views/index.hbs