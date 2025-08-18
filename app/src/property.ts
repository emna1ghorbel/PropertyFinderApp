import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Property } from '@/constants/types';
import Ip from '../id';
import useGetData from '../users/get';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
const ip = Ip();

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: `http://${ip}:3000/api/v1/` }),
  endpoints: (builder) => ({
    getProperties: builder.query<Property[], number>({
      
      query: (page) => `properties?page=${page}&limit=2`,
      transformResponse: (response: { items: Property[] }) => response.items,
    }),
  }),
});
export const propertytotal = createApi({
  reducerPath: 'propertytotal',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: `http://${ip}:3000/api/v1/` }),
  endpoints: (builder) => ({
    getPropertiestotal: builder.query<Property[], number>({
      
      query: () => 'properties?limit=100',
      transformResponse: (response: { items: Property[] }) => response.items,
    }),
  }),
});


interface FirebaseState {
  favs: Property[];
}

const initialState: FirebaseState = {
  favs: [],
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    setFavs: (state, action: PayloadAction<Property[]>) => {
      state.favs = action.payload;
    },
  },
});

export const { setFavs } = firebaseSlice.actions;
export default firebaseSlice.reducer;


export const { useGetPropertiestotalQuery } = propertytotal;










export const { useGetPropertiesQuery } = propertyApi;
