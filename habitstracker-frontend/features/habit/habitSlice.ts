import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHabits } from "./habitAPI";

type Habit = {
    _id: string;
    titulo: string;
    descripcion: string;
    createdAt: string;
}

type HabitState = {
    habits: Habit[];
}   

const initialState: HabitState = {
    habits: []
}

export const fetchHabitsThunk = createAsyncThunk("habits/fetchHabits", async () => {
    const response = await fetchHabits();
    const responseJSON = await response.json();
    return responseJSON;
});

const habitSlice = createSlice({
    name: "habits",
    initialState,
    reducers: {
        addHabits: (state, action) => {
            state.habits = action.payload;
        },
        addHabit: (state, action) => {
            state.habits.push(action.payload);
        },
        removeHabit: (state, action) => {
            state.habits = state.habits.filter(habit => habit._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchHabitsThunk.fulfilled, (state, action) => {
            state.habits = action.payload;
        });
    }
});     

export const { addHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;