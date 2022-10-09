import api from '.';

export const classesApi = api.injectEndpoints({
  endpoints: builder => ({
    getClasses: builder.query<Class, void>({
      query: () => 'classes?populate=*',
      providesTags: ['Classes']
    })
  })
});

export const { useGetClassesQuery } = classesApi;
