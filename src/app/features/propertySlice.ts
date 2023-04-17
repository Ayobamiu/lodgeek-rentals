import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Landlord, Property } from "../../models";
import filterUniqueByKey from "../../utils/filterUniqueIds";
import { initialNewProperty } from "../initialValues";
import { RootState } from "../store";

interface PropertyState {
  properties: Property[];
  landlords: Landlord[];
  newProperty: Property;
}

const initialState: PropertyState = {
  properties: [],
  landlords: [],
  newProperty: initialNewProperty,
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
    setNewProperty: (state, action: PayloadAction<Property>) => {
      state.newProperty = action.payload;
    },
    updateNewProperty: (state, action: PayloadAction<Partial<Property>>) => {
      state.newProperty = { ...state.newProperty, ...action.payload };
    },
    resetNewProperty: (state) => {
      state.newProperty = initialNewProperty;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      const currentProperties = [...state.properties];
      currentProperties.push(action.payload);
      state.properties = filterUniqueByKey(currentProperties, "id");
    },
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setLandlords: (state, action: PayloadAction<Landlord[]>) => {
      state.landlords = action.payload;
    },
  },
});

export const {
  addProperty,
  deleteProperty,
  setProperties,
  updateProperty,
  updateNewProperty,
  resetNewProperty,
  setLandlords,
  setNewProperty,
} = propertySlice.actions;

export const selectProperty = (state: RootState) => state.property;
export const selectProperties = (state: RootState) => state.property.properties;
export const selectNewProperty = (state: RootState) =>
  state.property.newProperty;

export default propertySlice.reducer;
