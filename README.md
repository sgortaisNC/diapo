# Diapo

Application de diaporama avec gestion d'images utilisant SvelteKit et Vercel Blob.

## Configuration Vercel Blob

Cette application utilise Vercel Blob pour stocker les images. Pour que l'upload fonctionne, vous devez configurer le token d'accès :

### Sur Vercel (Production)

1. Allez dans votre projet Vercel → **Settings** → **Environment Variables**
2. Ajoutez une variable d'environnement :
   - **Name**: `BLOB_READ_WRITE_TOKEN`
   - **Value**: Votre token Vercel Blob (disponible dans le dashboard Vercel Blob)
   - **Environments**: Production, Preview, Development

### En local (Développement)

Créez un fichier `.env` à la racine du projet :

```env
BLOB_READ_WRITE_TOKEN=votre_token_ici
```

Pour obtenir votre token :
1. Allez sur [Vercel Dashboard](https://vercel.com/dashboard)
2. Sélectionnez votre projet → **Storage** → **Blob**
3. Cliquez sur votre store (ex: "images")
4. Copiez le token depuis les paramètres du store

## Développement

```sh
pnpm install
pnpm dev
```

## Build

```sh
pnpm build
pnpm preview
```

## Déploiement

Le projet est configuré pour Vercel avec l'adapter `@sveltejs/adapter-vercel`.

**Important**: Assurez-vous que la variable d'environnement `BLOB_READ_WRITE_TOKEN` est configurée dans Vercel avant de déployer.
