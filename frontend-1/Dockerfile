# Utiliser l'image de base Node.js
FROM node:20

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port utilisé par le serveur de développement
EXPOSE 5173

# Commande pour démarrer le serveur de développement
CMD ["npm", "run", "dev"]