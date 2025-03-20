import { ApolloProvider } from '@apollo/client';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import client from './apolloClient';
import CharacterList from './components/CharacterList';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <div className="app">
          <header>
            <h1>Rick and Morty Characters</h1>
          </header>
          <main>
            <CharacterList />
          </main>
          <footer>
            <LanguageSwitcher />
            <p>Data provided by <a href="https://rickandmortyapi.com" target="_blank" rel="noopener noreferrer">Rick and Morty API</a></p>
          </footer>
        </div>
      </I18nextProvider>
    </ApolloProvider>
  );
}

export default App;
