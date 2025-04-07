import { UseSelector, useDispatch, useSelector } from "react-redux";
import { markAsDoneThunk, fetchAddHabitsThunk } from "@/features/habit/habitSlice";
import { RootState, AppDispatch} from "../Redux/store";
import { fetchHabitsThunk } from "@/features/habit/habitSlice";
import { useState } from "react";


type Habits = {

    _id: string;

    titulo: string;

    descripcion: string;
    createdAt: string;
    dias:number;
    lastDone: Date;
    lstUpdate: Date;


}

type HabitState = {

    habits: Habits[];

}

const handleMarkAsDone = (dispatch: AppDispatch, habitId: string, token: string) => {
    dispatch(markAsDoneThunk({habitId, token}));
    if(token){
        dispatch(fetchHabitsThunk(token));
    }
};
 

export default function Habits({habits}: HabitState) {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.habits.status);
    const error = useSelector((state: RootState) => state.habits.error);
    const user = useSelector((state: RootState) => state.user.user);
    const [titulo, setTitulo] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const calculateProgress = (days: number):number => {
        return Math.min((days/66)*100, 100);
    };
    const handleAddHabit = () => {
        if(titulo && descripcion){
            dispatch (fetchAddHabitsThunk({token: user?user.toString():"", titulo, descripcion}));
            setTitulo("");
            setDescripcion("");
            dispatch(fetchHabitsThunk(user?user.toString():""));
        }
    };

 

    return (

        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md mt-8">

            <h1 className="text-2xl font-bold mb-4 text-black">Habits</h1>

            <ul className="space-y-4">

            {habits.map((habit:Habits) => (

                    <li className="flex items-center justify-between" key={habit._id}>

                        <span className="text-black">{habit.titulo}</span>

                        <div className="flex items-center space-x-2">
                            <progress className="w-32 h-4" value={calculateProgress(habit.dias)} max="100"></progress>
                            <button className="px -2 py-1 text-sm text-white bg-blue-500 rounded-md" onClick={() => handleMarkAsDone(dispatch, habit._id, user ? user.toString():'' )}>{status[habit._id]=== "loading" ? "Processing" : "Mark as Done"}</button>
                            {status[habit._id] === "failed" && <span className="text-red-500">{error[habit._id]}</span>}
                            {status[habit._id] === "success" && <span className="text-green-500">Already marked as done</span>}

                        

                        </div>

                    </li>

                ))}

            </ul>

        </div>

    );

}