import {useEffect, useState} from "react";
import type {Schema} from "../amplify/data/resource";
import {generateClient} from "aws-amplify/data";

// type FeatureFlags = { [key: string]: boolean };

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [features, setFeatures] = useState<Array<Schema["EnabledFeatures"]["type"]>>([]);
  const [featuresList, setFeaturesList] = useState<Array<string>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    client.models.EnabledFeatures.observeQuery().subscribe({
      next: (data) => setFeatures([...data.items]),
    })

    client.queries.getFeatureFlags().then(value => {
      const buildTimeFeatureFlags: string[] = JSON.parse(value.data || '[]');
      console.log('buildTime FFs:', buildTimeFeatureFlags)
    })
  }, []);

  useEffect(() => {
    const featuresDef = JSON.parse(features[0]?.features as string || '[]');
    if (Array.isArray(featuresDef)) {
      setFeaturesList([...featuresDef]);
      console.log("features update received:", featuresDef);
    }
  }, [features]);

  function createTodo() {
    client.models.Todo.create({content: window.prompt("Todo content")});
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id})
  }

  return (
    <main>
      <div>
        <img src="./public/fwIcon.svg" width="50" height="50"/>
        <h1>fieldwire 2.0</h1>
      </div>
      <h2>My todos</h2>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            onClick={() => deleteTodo(todo.id)}
            key={todo.id}>
            {todo.content}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
