FROM node:20

# Dossier de travail
WORKDIR /app

# Copier les fichiers
COPY package*.json ./
RUN npm install

COPY . .

# Rendre le script exécutable
COPY wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x /app/wait-for-it.sh

EXPOSE 5001

CMD ["npm", "start"]


