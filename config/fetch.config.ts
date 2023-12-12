import { registerAs } from '@nestjs/config';

export interface FetchAPIConfig {
    API_BASE: string;
    API_ENDPOINT: string;
    API_KEY: string;
}

export const fetchConfig = registerAs('fetchAPI', (): FetchAPIConfig => {
    return {
        API_BASE: process.env.API_BASE || 'https://pokeapi.co/api/v2/',
        API_ENDPOINT: process.env.API_ENDPOINT || 'pokemon?',
        API_KEY: process.env.API_KEY || '',
    }
})