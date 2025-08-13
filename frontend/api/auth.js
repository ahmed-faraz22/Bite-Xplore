export const registerUser = async({ name, email, phone, password }) => {
    try {
       const res = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify({name, email, phone, password})
       }) 

       const data = await res.json();

       if(!res.ok) throw new Error(data.message || 'Registration failed');

       return data;

    } catch (error) {
        throw new Error(error.message)
    }
}

export const loginUser = async({ email, password }) => {
    try {
       const res = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {'Content-type' : 'application/json'},
        body: JSON.stringify({ email, password})
       }) 

       const data = await res.json();

       if(!res.ok) throw new Error(data.message || 'Login failed');

       return data;

    } catch (error) {
        throw new Error(error.message)
    }
}