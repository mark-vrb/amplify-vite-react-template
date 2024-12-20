import {useEffect, useState} from "react";
import type {Schema} from "../amplify/data/resource";
import {generateClient} from "aws-amplify/data";

// type FeatureFlags = { [key: string]: boolean };

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  // const [features, setFeatures] = useState<Array<Schema["EnabledFeatures"]["type"]>>([]);

  const [buildTimeFeatures, setBuildTimeFeatures] = useState<string>();
  const [liveFeatures, setLiveFeatures] = useState<string>();

  const [featuresList, setFeaturesList] = useState<string>();
  const [hackwireLogo, setHackwireLogo] = useState<boolean>(false);

  const dialog = document.querySelector("dialog");

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    client.models.EnabledFeatures.observeQuery().subscribe({
      next: (data) => {
        const features = JSON.parse(data.items[0]?.features as string || '[]');

        if (Array.isArray(features)) {
          setLiveFeatures(JSON.stringify(features));
        }
      }
    });

    client.queries.getFeatureFlags().then(value => {
      const features = value.data || '[]';
      setBuildTimeFeatures(features);
    })
  }, []);

  useEffect(() => {
    if (!buildTimeFeatures || !liveFeatures) return;

    const buildTime = JSON.parse(buildTimeFeatures) as string[];
    const live = JSON.parse(liveFeatures) as string[];

    const set = new Set([...buildTime, ...live]);
    if (set.has('hackwireLogo')) {
      setHackwireLogo(true);
    } else {
      setHackwireLogo(false);
    }
    setFeaturesList(JSON.stringify(Array.from(set)));
  }, [buildTimeFeatures, liveFeatures]);

  useEffect(() => {
    if (!featuresList) return;
    console.log("features update received:", featuresList);
    dialog?.showModal();
  }, [dialog, featuresList]);

  function createTodo() {
    client.models.Todo.create({content: window.prompt("Todo content")});
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({id})
  }

  function refreshPage() {
    dialog?.close();
    document.location.reload();
  }

  function closeDialog() {
    dialog?.close();
  }

  return (
    <main>
      <div className="header">
        <img src="/fwIcon.svg" width="50" height="50" alt={'fwLogo'}/>
        { hackwireLogo ?
          <h1><s>Fieldwire</s> Hackwire</h1> :
          <h1>Fieldwire</h1>
        }
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

      <dialog>
        <p>New version of the app available!</p>
        <div className="dialog-buttons">
          <button className="secondary" onClick={closeDialog}>Cancel</button>
          <button onClick={refreshPage}>Refresh</button>
        </div>
      </dialog>
    </main>
  );
}

export default App;
