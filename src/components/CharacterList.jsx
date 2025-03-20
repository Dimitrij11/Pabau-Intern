import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { gql } from '@apollo/client';
import './CharacterList.css';

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!, $status: String, $species: String) {
    characters(page: $page, filter: { status: $status, species: $species }) {
      info {
        next
        pages
      }
      results {
        id
        name
        status
        species
        gender
        image
        origin {
          name
        }
      }
    }
  }
`;

const CharacterList = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('');
  const [species, setSpecies] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [characters, setCharacters] = useState([]);
  const [uniqueSpecies, setUniqueSpecies] = useState([]);
  const charactersGridRef = useRef();
  const loadingRef = useRef(false);

  const { loading, error, data } = useQuery(GET_CHARACTERS, {
    variables: {
      page,
      status,
      species,
    },
  });

  useEffect(() => {
    if (data?.characters?.results) {
      setCharacters(prev => [...prev, ...data.characters.results]);
      
      const currentSpecies = data.characters.results.map(char => char.species);
      setUniqueSpecies(prev => {
        const newSpecies = [...new Set([...prev, ...currentSpecies])].sort();
        return newSpecies;
      });
    }
  }, [data]);

  useEffect(() => {
    const handleScroll = () => {
      if (!charactersGridRef.current || loadingRef.current) return;

      const grid = charactersGridRef.current;
      const scrollPosition = grid.scrollLeft + grid.clientWidth;
      const scrollWidth = grid.scrollWidth;
      const threshold = 100; 

      if (scrollWidth - scrollPosition <= threshold && data?.characters?.info?.next) {
        loadingRef.current = true;
        setPage(prev => prev + 1);
      }
    };

    const grid = charactersGridRef.current;
    if (grid) {
      grid.addEventListener('scroll', handleScroll);
      return () => grid.removeEventListener('scroll', handleScroll);
    }
  }, [data]);

  useEffect(() => {
    if (!loading) {
      loadingRef.current = false;
    }
  }, [loading]);

  const handleFilterChange = (filterType, value) => {
    setCharacters([]);
    setPage(1);
    if (filterType === 'status') {
      setStatus(value);
    } else if (filterType === 'species') {
      setSpecies(value);
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedCharacters = [...characters].sort((a, b) => {
    const aValue = sortBy === 'origin' ? a.origin.name : a[sortBy];
    const bValue = sortBy === 'origin' ? b.origin.name : b[sortBy];
    return sortOrder === 'asc' 
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  if (error) return <div className="error">{t('error')}</div>;

  return (
    <div className="character-list">
      <div className="filters">
        <select
          value={status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
        >
          <option value="">{t('filterByStatus')}</option>
          <option value="alive">{t('alive')}</option>
          <option value="dead">{t('dead')}</option>
          <option value="unknown">{t('unknown')}</option>
        </select>

        <select
          value={species}
          onChange={(e) => handleFilterChange('species', e.target.value)}
        >
          <option value="">{t('filterBySpecies')}</option>
          {uniqueSpecies.map(species => (
            <option key={species} value={species}>
              {species}
            </option>
          ))}
        </select>

        <button onClick={() => handleSort('name')}>
          {t('sortByName')} {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
        <button onClick={() => handleSort('origin')}>
          {t('sortByOrigin')} {sortBy === 'origin' && (sortOrder === 'asc' ? '↑' : '↓')}
        </button>
      </div>

      <div className="characters-grid" ref={charactersGridRef}>
        {sortedCharacters.map((character) => (
          <div
            key={character.id}
            className="character-card"
          >
            <div className="character-image">
              <img src={character.image} alt={character.name} />
            </div>
            <div className="character-info">
              <h3>{character.name}</h3>
              <p><strong>{t('status')}:</strong> {t(character.status.toLowerCase())}</p>
              <p><strong>{t('species')}:</strong> {character.species}</p>
              <p><strong>{t('gender')}:</strong> {character.gender}</p>
              <p><strong>{t('origin')}:</strong> {character.origin.name}</p>
            </div>
          </div>
        ))}
      </div>

      {loading && <div className="loading">{t('loading')}</div>}
    </div>
  );
};

export default CharacterList; 