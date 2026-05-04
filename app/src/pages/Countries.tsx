import React, { useEffect, useState, useContext } from 'react';
import { Search, Globe, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculatorApi } from '@/services/api';
import type { Country } from '@/types';
import SEO from '@/components/SEO';
import { RouterContext } from '@/App';

const Countries: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const { setCurrentPage } = useContext(RouterContext);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    filterCountries();
  }, [searchQuery, selectedRegion, countries]);

  const fetchCountries = async () => {
    try {
      const response = await calculatorApi.getCountries();
      setCountries(response.data);
      setFilteredCountries(response.data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    }
  };

  const filterCountries = () => {
    let filtered = countries;

    if (searchQuery) {
      filtered = filtered.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.currencyCode.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedRegion !== 'All') {
      filtered = filtered.filter((country) => country.region === selectedRegion);
    }

    setFilteredCountries(filtered);
  };

  const regions = ['All', ...Array.from(new Set(countries.map((c) => c.region)))];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: countries.slice(0, 10).map((country, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: country.name,
    })),
  };

  return (
    <div className="space-y-8">
      <SEO
        title="Supported Countries - Global Paycheck Calculator"
        description="View all countries supported by our paycheck calculator. Calculate salaries and taxes for USA, UK, Canada, Australia, and 100+ countries worldwide."
        schema={schema}
      />

      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-3">
          <Globe className="h-8 w-8 text-primary" />
          Supported Countries
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our paycheck calculator supports {countries.length}+ countries worldwide. 
          Select your country to calculate your net salary and taxes.
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {regions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedRegion === region
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Countries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCountries.map((country) => (
          <button
            key={country.code}
            onClick={() => setCurrentPage('calculator')}
            className="group text-left p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium">{country.name}</span>
              <span className="text-2xl">{country.currencySymbol}</span>
            </div>
            <div className="space-y-1 mt-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Currency</span>
                <span className="font-medium">{country.currencyCode}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Region</span>
                <span className="font-medium">{country.region}</span>
              </div>
            </div>
            <div className="pt-2 flex items-center text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Calculate Now
              <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </button>
        ))}
      </div>

      {/* Empty State */}
      {filteredCountries.length === 0 && (
        <div className="text-center py-12">
          <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No countries found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {countries.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Countries Supported</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {regions.length - 1}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Regions Covered</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-primary">
              {new Set(countries.map((c) => c.currencyCode)).size}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Currencies</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-3xl font-bold text-primary">100%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Free to Use</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Countries;
