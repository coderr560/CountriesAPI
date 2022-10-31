let $ = document.querySelector.bind(document);
let $$ = document.querySelectorAll.bind(document);
let log = console.log.bind(console);

function get$(el) {
  return el.querySelector.bind(el);
}

let countriesEl = $('#countries');
let darkModeBtn = $('#dark-mode');
let searchEl = $('#search');
let filterBtn = $('#filter');
let filterRegion = filterBtn.querySelectorAll('li');
let modal = $('#modal');
let closeBtn = $('#close');

get_countries();

// sort an array by name.common key.
function sort_by_key(array) {
  return array.sort(function (a, b) {
    //console.log(a.name.common);
    var x = a.name.common;
    var y = b.name.common;
    return x < y ? -1 : x > y ? 1 : 0;
  });
}

async function get_countries() {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const countries = await res.json();

  //console.log(countries); // unsorted, as they come from the API.
  //countries_sorted = sort_by_key(countries);
  sort_by_key(countries);
  //console.log(countries_sorted);

  displayCountries(countries);
}

function displayCountries(countries) {
  // clear the element before displaying the countries.
  countriesEl.innerHTML = '';

  countries.forEach(country => {
    let template = $('#countryElTemplate');
    let clone = template.content.cloneNode(true);
    let _$ = get$(clone);

    _$('img').src = country.flags.svg;
    _$('.country-name').innerText = country.name.common;
    _$('.country-cca').innerText = `${country.cca2}, ${country.cca3}`;

    _$('.country-capital-val').innerText = country.capital;
    _$('.country-region-val').innerText = country.region;
    _$('.country-population-val').innerText =
      country.population.toLocaleString();

    _$('.card').addEventListener('click', () => {
      modal.style.display = 'flex';
      show_country_details(country);
    });
    countriesEl.appendChild(clone);
  });
}

function show_country_details(country) {
  // console.log(typeof country);
  const modal_body = modal.querySelector('.modal-body');
  const modal_img = modal.querySelector('img');

  modal_img.src = country.flags.svg;

  {
    // extract all JSON keys from under country.currencies
    currencies = Object.keys(country.currencies);
    //console.log("currencies: " + currencies);

    var currencies_list = '';

    currencies.forEach(key => {
      //console.log("key: " + key); // e.g.: AFN.
      // country -> currencies -> AFN -> name (which has the value of "Afagan afghani")
      //console.log("name: " + country.currencies[key].name);
      currencies_list = currencies_list + country.currencies[key].name + ', ';
    });
    currencies_list = currencies_list.slice(0, -2); // remove the last comma.
    //console.log("currencies_list: " + currencies_list);
  }

  {
    languages = Object.keys(country.languages);
    //console.log("languages: " + languages);

    var languages_list = '';

    languages.forEach(key => {
      //console.log("key: " + key);
      //console.log("name: " + country.languages[key]);
      languages_list = languages_list + country.languages[key] + ', ';
    });
    languages_list = languages_list.slice(0, -2); // remove the last comma.
    //console.log("languages_list: " + languages_list);
  }

  modal_body.innerHTML = `
        <h2 class=country-name">${country.name.common}</h2>
        <p>
            <strong>CCA2:</strong>
            ${country.cca2}
        <p>
            <strong>Region:</strong>
            ${country.region}
        </p>
        <p>
            <strong>Area:</strong>
            ${country.area}
        </p>
        <p>
            <strong>Capital:</strong>
            ${country.capital}
        </p>
        <p>
            <strong>Population:</strong>
            ${country.population.toLocaleString()}
        </p>
        <p>
            <strong>latlng:</strong>
            ${country.latlng}
        </p>
        <p>
            <strong>Time Zones:</strong>
            ${country.timezones}
        </p>
        <p>
            <strong>Currencies:</strong>
            ${currencies_list}
        </p>
        <p>
            <strong>Languages:</strong>
            ${languages_list}
        </p>
        <p>
            <strong>Borders:</strong>
            ${country.borders}
        </p>
    `;
}

// enable dark mode by default.
document.body.classList.toggle('dark');

// toggle the dark class.
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// toggle the filter class.
filterBtn.addEventListener('click', () => {
  filterBtn.classList.toggle('open');
});

// close the modal.
closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

// search by country name.
// apply a style based on the search value from the search input.
searchEl.addEventListener('input', e => {
  const search_term = e.target.value;
  //console.log(search_term);

  // the search applies to multiple classes.
  const query_list = document.querySelectorAll('.country-name');

  var results_count = 0;

  // use the HTML that we already have in the DOM.
  // and only apply a style on it, hiding or showing it.
  query_list.forEach(i => {
    //console.log("innerText: " + i.innerText);
    if (i.innerText.toLowerCase().includes(search_term.toLowerCase())) {
      // .card -> .card-body -> .country-name.
      i.parentElement.parentElement.style.display = 'block';
      results_count++;
    } else {
      // do not show it.
      i.parentElement.parentElement.style.display = 'none';
    }
  });

  if (results_count == 0) {
    console.log('No results!');
    //alert("No results!");
  }
});

// add a filter on the li inside the .dropdown.
filterRegion.forEach(filter => {
  filter.addEventListener('click', e => {
    filter_value = filter.innerHTML;
    //console.log(filter_value);

    const query_list = document.querySelectorAll('.country-region');

    // use the HTML that we already have in the DOM.
    // and only apply a style on it, hiding or showing it.
    query_list.forEach(i => {
      console.log('innerText: ' + i.innerText);
      if (i.innerText.includes(filter_value) || filter_value === 'All') {
        i.parentElement.parentElement.style.display = 'block';
      } else {
        // do not show it.
        i.parentElement.parentElement.style.display = 'none';
      }
    });
  });
});
