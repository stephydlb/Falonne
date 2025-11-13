# Home Nail's 241

Site web vitrine pour Home Nail's 241, un salon de manucure et pédicure mobile à Libreville, Gabon.

## Fonctionnalités

- **Site vitrine responsive**
- **Design moderne et élégant**
- **Système de réservation en ligne**
- **Paiement en ligne sécurisé** (Stripe)
- **Carte interactive** avec localisation
- **Animations fluides**
- **Optimisé pour mobile**
- **Performance optimisée**

## Technologies utilisées

- HTML5, CSS3, JavaScript (Vanilla)
- [Leaflet.js](https://leafletjs.com/) pour la carte interactive
- [Stripe](https://stripe.com/) pour les paiements
- [Formspree](https://formspree.io/) pour le formulaire de contact
- [Font Awesome](https://fontawesome.com/) pour les icônes

## Structure du projet

```
.
├── dist/                  # Fichiers optimisés pour la production
├── assets/               # Images, polices et autres ressources
│   ├── logo.svg
│   └── ...
├── pictures/             # Galerie d'images
│   ├── galerie/
│   │   ├── nails/
│   │   ├── tonails/
│   │   └── hommes/
│   └── ...
├── index.html            # Page d'accueil
├── contact.html          # Page de contact
├── reservation.html      # Page de réservation
├── confirmation.html     # Page de confirmation
├── styles.css            # Feuille de style principale
├── script.js             # JavaScript principal
└── README.md             # Ce fichier
```

## Installation et lancement

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)

### Installation

1. Cloner le dépôt :
   ```bash
   git clone https://github.com/votre-utilisateur/falonne.git
   cd falonne
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

### Développement

Pour lancer un serveur de développement :

```bash
npx serve
```

Le site sera accessible à l'adresse : [http://localhost:3000](http://localhost:3000)

### Production

Pour générer les fichiers de production optimisés :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

Pour tester la version de production localement :

```bash
npm start
```

## Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```
STRIPE_PUBLIC_KEY=votre_cle_publique_stripe
FORMSPREE_FORM_ID=votre_id_formspree
```

## Déploiement

Le site peut être déployé sur n'importe quel service d'hébergement web statique comme :

- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- [GitHub Pages](https://pages.github.com/)

### Déploiement sur Netlify

1. Connectez-vous à [Netlify](https://app.netlify.com/)
2. Sélectionnez "New site from Git"
3. Choisissez votre dépôt
4. Configurez les paramètres de build :
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Cliquez sur "Deploy site"

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Contact

- Téléphone : +241 07 77 39 09 7
- Email : [votre@email.com](mailto:votre@email.com)
- Adresse : Quartier Louis, Libreville, Gabon
