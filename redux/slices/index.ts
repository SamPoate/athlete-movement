import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HYDRATE } from 'next-redux-wrapper';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV !== 'development'
        ? 'https://athlete-movement.herokuapp.com/api/' // 'http://localhost:1337/api/'
        : 'https://athlete-movement.herokuapp.com/api/'
  }),
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === HYDRATE) {
      return action.payload[reducerPath];
    }
  },
  tagTypes: ['Classes'],
  endpoints: () => ({})
});

export default api;
