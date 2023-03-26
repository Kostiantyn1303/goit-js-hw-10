import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchForm: document.querySelector('#search-box'),
  countryListEl: document.querySelector('.country-list'),
  countryInfoEL: document.querySelector('.country-info'),
};

const handleSearchCountry = event => {
  event.preventDefault();

  const formValue = event.target.value.trim();
  if (formValue === '') {
    refs.countryListEl.innerHTML = '';
    refs.countryInfoEL.innerHTML = '';
    return;
  }

  fetchCountries(formValue)
    .then(data => {
      if (data.length > 10) {
        return Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else if (data.length === 1) {
        const markup = data
          .map(({ name, flags }) => {
            return `<li><div class="wrapper__flag">
          <img src="${flags.svg}" alt="flags" width="50">
          <h2 class="country__title">${name.official}</h2>
        </div></li>`;
          })
          .join('');
        refs.countryListEl.innerHTML = markup;
        const markupInfo = data
          .map(({ population, languages, capital }) => {
            return `<p>Population:${population}</p>
      <p>Capital:${capital}</p>
      <p>Languages:${Object.values(languages)}</p>`;
          })
          .join('');
        refs.countryInfoEL.innerHTML = markupInfo;
      } else if (data.length < 10) {
        const markup = data
          .map(({ name, flags }) => {
            return `<li class = 'country__item'><div class="wrapper__flag">
      <img src="${flags.svg}" alt="flags" width="50">
      <h2 class="country__title--small">${name.official}</h2>
    </div></li>`;
          })
          .join('');
        refs.countryListEl.innerHTML = markup;
        refs.countryInfoEL.innerHTML = ' ';
      }
    })
    .catch(console.error());
};

refs.searchForm.addEventListener(
  'input',
  debounce(handleSearchCountry, DEBOUNCE_DELAY)
);
