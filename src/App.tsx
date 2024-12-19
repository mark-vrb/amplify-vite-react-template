import {useEffect, useState} from "react";
import type {Schema} from "../amplify/data/resource";
import {generateClient} from "aws-amplify/data";

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
  }, []);

  useEffect(() => {
    const featuresDef = features[0]?.features;
    if (Array.isArray(featuresDef)) {
      setFeaturesList([...featuresDef]);
    }
  }, [features]);

  client.queries.sayHello({name: 'bro'}).then(value => {
    console.log(value)
  })

  function createTodo() {
    client.models.Todo.create({content: window.prompt("Todo content")});
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id})
  }

  return (
    <main>
      <h1>My todos</h1>
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
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br/>
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>

      <div>
        <h3>My features</h3>
        {featuresList.map((feature) => (
          <div>{feature}</div>
        ))}
      </div>
    </main>
  );
}

export default App;
