import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchHabits, fetchAddHabits } from "./habitAPI";

type Habit = {
    _id: string;
    titulo: string;
    descripcion: string;
    createdAt: string;
    dias:number;
    lastDone: Date;
    lstUpdate: Date;
    startedAt: Date;
}
type markAsDoneThunkParams = {
    habitId: string;
    token: string;
}
type addHabitThunkParams = {
    token: string;
    titulo: string;
    descripcion: string;
}

type HabitState = {
    habits: Habit[];
    status: Record<string,"idle" | "loading" | "success" | "failed">;
    error: Record<string, string | null>;
}   

const initialState: HabitState = {
    habits: [],
    status: {},
    error: {}
}

export const fetchHabitsThunk = createAsyncThunk("habits/fetchHabits", async (token:string, {rejectWithValue}) => {
    const response  = await fetchHabits(token); 
    const responseJSON = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to fetch habits");
    }
    return responseJSON;
});

export const markAsDoneThunk = createAsyncThunk("habits/markAsDone", async ({habitId, token}: markAsDoneThunkParams,  {rejectWithValue}) => {
    const response = await fetch(`http://localhost:3001/habits/markasdone/${habitId}`, {
        method: "PATCH",
        headers: {
            Authorization: 'Bearer '+token,
            "Content-Type": "application/json"
        },
    });
    const responseJSON = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to mark habit as Done");
    }else if (responseJSON.message.toString() === "Habit restarted") {
        return rejectWithValue(responseJSON.message);
    }else{
        return responseJSON.message;
    }
});

export const fetchAddHabitsThunk = createAsyncThunk("habits/fetchAddHabits", async ({token, titulo, descripcion}: addHabitThunkParams, {rejectWithValue}) => {
    const response = await fetchAddHabits(token, titulo, descripcion);
    const responseJSON = await response.json();
    if (!response.ok) {
        return rejectWithValue("Failed to add habit");
    }else if (responseJSON.message.toString() === "Error creating Habit") {
        return rejectWithValue(responseJSON.message);
    }else {
        return responseJSON.token;
    }
}
);

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
        }).addCase(markAsDoneThunk.fulfilled, (state, action) => {
            state.status[action.meta.arg.habitId] = "success";
            state.error[action.meta.arg.habitId] = null;
        }).addCase(markAsDoneThunk.rejected, (state, action) => {
            state.status[action.meta.arg.habitId] = "failed";
            state.error[action.meta.arg.habitId] = action.payload as string;
         }).addCase(fetchAddHabitsThunk.fulfilled, (state, action) => {
            state.habits.push(action.payload);
        });
    }
});     

export const { addHabits, addHabit, removeHabit } = habitSlice.actions;
export default habitSlice.reducer;