FROM node:20-alpine

# NOTA: Este Dockerfile está pensado para construirse desde la raíz del monorepo
# o con contexto ajustado. Ajustar según necesidades de despliegue real.

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "index.js"]
