import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      name: 'Name',
      status: 'Status',
      species: 'Species',
      gender: 'Gender',
      origin: 'Origin',
      alive: 'Alive',
      dead: 'Dead',
      unknown: 'Unknown',
      filterByStatus: 'Filter by Status',
      filterBySpecies: 'Filter by Species',
      sortByName: 'Sort by Name',
      sortByOrigin: 'Sort by Origin',
      loading: 'Loading...',
      error: 'Error loading characters',
      loadMore: 'Load More',
    },
  },
  de: {
    translation: {
      name: 'Name',
      status: 'Status',
      species: 'Spezies',
      gender: 'Geschlecht',
      origin: 'Herkunft',
      alive: 'Lebendig',
      dead: 'Tot',
      unknown: 'Unbekannt',
      filterByStatus: 'Nach Status filtern',
      filterBySpecies: 'Nach Spezies filtern',
      sortByName: 'Nach Namen sortieren',
      sortByOrigin: 'Nach Herkunft sortieren',
      loading: 'Laden...',
      error: 'Fehler beim Laden der Charaktere',
      loadMore: 'Mehr laden',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n; 