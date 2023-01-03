import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Property } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { RootState } from "../store";

interface PropertyState {
  properties: Property[];
}

const initialState: PropertyState = {
  properties: [],
};
export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    deleteProperty: (state, action: PayloadAction<Property>) => {
      const currentProperties = [...state.properties];
      const propertyIndex = currentProperties.findIndex(
        (i) => i.id === action.payload.id
      );
      currentProperties.splice(propertyIndex, 1);
      state.properties = currentProperties;
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const currentProperties = [...state.properties];
      const propertyIndex = currentProperties.findIndex(
        (i) => i.id === action.payload.id
      );
      currentProperties.splice(propertyIndex, 1, action.payload);
      state.properties = currentProperties;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      const currentProperties = [...state.properties];
      currentProperties.push(action.payload);
      state.properties = filterUniqueByKey(currentProperties, "id");
    },
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
  },
});

export const { addProperty, deleteProperty, setProperties, updateProperty } =
  propertySlice.actions;

export const selectProperties = (state: RootState) => state.property.properties;

export default propertySlice.reducer;
