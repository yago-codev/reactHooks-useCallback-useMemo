import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const UserList = ({ users, query }) => {
  const filter = (users, query) => users.filter(user => {
    console.log('Filter re-render');
    return user.name.toLowerCase().includes(query);
  })
  
  const filtered = useMemo(() => filter(users, query), [users, query]);
  return filtered.map(user => <div key={user.id}>{user.name}</div>);
}

const Button = ({ children, ...props }) => {
  useEffect(() => {
    return console.log('Button re-render')
  });

  useEffect(() => {
    return console.log('Button on click changed');
  }, [props.onClick]);

  return (
    <button {...props}>
      { children }      
    </button>
  );
}

export const App = () => {
  const [count, setCount] = useState(0); 
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);

  const getUsers = useCallback(async() => {
    try {
      const { data } = await axios.get('https://jsonplaceholder.typicode.com/users/');
      setUsers(data);
    } catch(error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getUsers();
    console.log('App re-render');
  }, [getUsers]);

  return (
    <>
      <h1>useCallback vs useMemo</h1>
      <div>
        { count }
      </div>
      {/* useCallback ira salvar a funcao em memoria, baseado em igualdade referencial.
          ou seja, a funcao nao sera executada novamente, a menos que mude.
      */}
      <Button type='button' onClick={useCallback(() => setCount(prev => prev + 1), [])}>
        Increment useCallback
      </Button>
      
      <div>
        <input type='text' onChange={event => setQuery(event.target.value)} />
        <UserList users={users} query={query} />
      </div>
    </>
  )
};
