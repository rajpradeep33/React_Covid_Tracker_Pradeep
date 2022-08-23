import React, { useState, useEffect } from 'react';
import './App.scss';
import DropdownWithSearchInput from './components/DropdownWithSearchInput/DropdownWithSearchInput';
import { Card, CardContent } from '@material-ui/core';
import LiveCaseList from './components/LiveCaseList/LiveCaseList';
import { prettyPrintStat, sortData } from './utils';
import StatsCard from './components/StatsCard/StatsCard';
import LeafletMap from './components/LeafletMap/LeafletMap';
import "leaflet/dist/leaflet.css";
import LineGraph from './components/LineGraph/LineGraph';
import { API_PREFIX } from './config';

const defaultMapConfig = {
  center: { lat: 20.5937, lng: 78.9629 },
  zoom: 3
};

function getRequiredData(data) {
  return {
    active: data.active,
    cases: data.cases,
    continent: data.continent,
    country: data.country,
    countryInfo: data.countryInfo,
    critical: data.critical,
    deaths: data.deaths,
    recovered: data.recovered,
    tests: data.tests,
    todayCases: data.todayCases,
    todayDeaths: data.todayDeaths,
    todayRecovered: data.todayRecovered,
  }
}

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState(null);
  const [countriesWithCasesInfo, setCountriesWithCasesInfo] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [caseType, setCaseType] = useState("cases");
  const [mapCenter, setMapCenter] = useState(null);
  const [mapZoom, setMapZoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAllCountryData = async () => {
      await fetch(`${API_PREFIX}/countries`)
        .then(response => response.json())
        .then(countryData => {
          const countries = [];
          const countryWithRequiredData = [];

          for (const data of countryData) {
            countries.push({
              name: data.country,
              code: data.countryInfo.iso2
            });
            countryWithRequiredData.push(getRequiredData(data));
          }

          setCountries(countries);
          setCountriesWithCasesInfo(countryWithRequiredData);
        });
    };
    getAllCountryData();
  }, []);

  useEffect(() => {
    const url = country ? `${API_PREFIX}/countries/${country.code}` : `${API_PREFIX}/all`;
    const fetchCountryInfo = async () => {
      setIsLoading(true);
      await fetch(url)
        .then(response => response.json())
        .then(countryData => {
          setCountryInfo(getRequiredData(countryData));
          if (country) {
            setMapCenter({
              lat: countryData.countryInfo.lat,
              lng: countryData.countryInfo.long
            });
            setMapZoom(4);
          } else {
            setMapCenter(defaultMapConfig.center);
            setMapZoom(defaultMapConfig.zoom);
          }
          setIsLoading(false);
        });
    }
    fetchCountryInfo();
  }, [country]);

  const onCountryChange = (selectedCountry) => setCountry(selectedCountry);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <DropdownWithSearchInput
            selectedValue={country}
            onSelected={onCountryChange}
            placeholder={"Worldwide"}
            dropdownData={countries}
          />
        </div>
        <div className="app__stats">
          <StatsCard
            isLoading={isLoading}
            title="Registered cases"
            type="totalcases"
            onClick={e => setCaseType('cases')}
            active={caseType === 'cases'}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <StatsCard
            isLoading={isLoading}
            title="Recovered cases"
            type="recovered"
            onClick={e => setCaseType('recovered')}
            active={caseType === 'recovered'}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <StatsCard
            isLoading={isLoading}
            title="Registerd deaths"
            type="deaths"
            onClick={e => setCaseType('deaths')}
            active={caseType === 'deaths'}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
          <StatsCard
            isLoading={isLoading}
            title="Active cases"
            type="activecases"
            onClick={() => { }}
            cases={prettyPrintStat(countryInfo.active)}
          />
        </div>
        <div className="app__map">
          {
            countriesWithCasesInfo?.length > 0 && (
              <LeafletMap
                caseType={caseType}
                countriesWithData={countriesWithCasesInfo}
                center={mapCenter}
                zoom={mapZoom}
              />
            )
          }

        </div>
      </div>
      <div className="app__right">
        <Card>
          <CardContent>
            <LiveCaseList countriesWithData={sortData(countriesWithCasesInfo)} />
            <LineGraph caseType={caseType} className="app_graph" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default App;
