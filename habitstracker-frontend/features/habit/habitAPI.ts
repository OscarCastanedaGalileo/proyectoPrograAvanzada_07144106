export const fetchHabits = async (token:string) => {
    const response = await fetch("http://localhost:3001/habits", {
        headers: {Authorization: 'Bearer '+token}
      });
    if (!response.ok) {
        throw new Error("Failed to fetch habits");
    }
    return response;
  };
  
  export const fetchAddHabits = async (token:string, titulo:string, descripcion:string) => {
    const response = await fetch("http://localhost:3001/habits", {
        method: 'POST',
        headers: {Authorization: 'Bearer '+token ,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "titulo": titulo,
          "descripcion": descripcion
        })
      });
    if (!response.ok) {
        throw new Error("Failed to fetch habits");
    }
    return response;
  };