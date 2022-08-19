import './css/styles.css';
import { fetchCountries } from "./fetchCountries.js"
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info')
}

refs.input.addEventListener('input', debounce(onInputTyping, DEBOUNCE_DELAY))

function onInputTyping(evt) {
  evt.preventDefault();

  const countryName = evt.target.value.trim();

  if (!countryName || countryName === "") {
    clearList();
    clearInfo();
  }
  
    fetchCountries(countryName)
      .then(data => {
        // When array after providing letter/letters includes more then ten objects with information about countries, don't show any information and add notification:
        if (data.length > 10) {
          Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
          clearList();
          clearInfo();

        }
        // When array after providing letter/letters includes from two to ten objects with information about countries, show common name of country and flag:
          else if (data.length >= 2 && data.length <= 10) {
            clearInfo()
            createCountriesMarkup(data);
          }
          // When array after providing letter/letters includes only one country we show flag, common name, official name, capital, population number and languages, then clear the information container if it isn't empty:
            else {
              clearList()
                showInfoAboutCountry(data);
            }
      })
    // If ERROR show it in console and then delete all the information from info container and country list:
    .catch(error => {
      console.log(error);
      clearList();
      clearInfo();
    }
    )
  }

// Render information about country (if it is the only one in array of found countries):
function showInfoAboutCountry(obj) {
  const countryData = obj.reduce((acc, {
    name: { common, official },
    capital,
    population,
    flags: { svg },
    languages
  }) => {
    return acc +
      `<ul class="country-info-list">
    <li class="country-info-list-heading"><img class="flag--small" src="${svg}" alt="${common}"> <b class="country-info-name">${common}</b></li>
    <li><b>Official name:</b> ${official}</li>
    <li><b>Capital:</b> ${capital}</li>
    <li><b>Population:</b> ${population}</li>
    <li><b>Languages:</b> ${Object.values(languages).join(", ")}</li>
    </ul>
    `
  }, '');

  // Put rendered information about contry into info container, which is empty:
  refs.info.innerHTML = countryData;
}

// Render list of countries (their flag and common name):
function createCountriesMarkup(countries) {
    const markup = countries.reduce((acc, {
      name: {common},
      flags: { svg },
    }) => {
      return acc +
        `<li class="country-list-item">
        <img class = "flag" src="${svg}" alt="${common}">
          <p> ${common}</p>
        </li>`
    }, '')
  
  //  Put rendered list of contries into country list, which is empty:
  refs.list.innerHTML = markup
}

// Clear country list
function clearList() {
  refs.list.innerHTML = "";
}

// Clear info container
function clearInfo() {
  refs.info.innerHTML = "";
}

  
