import { useEffect, useState } from 'react';
import './App.css';
import { timeGreeting } from './Utils/TimeUtils';
import './Components/leftSection.css';
import './Components/rightSection.css';
import './Components/centerSection.css';

function Home() {
    const today = new Date().toLocaleString("en-IN", { weekday: "long", });
    const time = timeGreeting[new Date().getHours()];
    const [err, setErr] = useState(false);
    const [text, setText] = useState("");
    const [desc, setDesc] = useState("");
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [deleted, setDeleted] = useState([]);
    const [saveSession, setSaveSession] = useState(true);

    const regEx = /^[a-zA-Z][a-zA-Z ]*$/;

    const handleList = (value) => {
        let stat = regEx.test(text);
        if (!stat) {
            setErr(true);
            return;
        } else {
            const todoItem = {
                id: Date.now(),
                deleted: false,
                completed: false,
                pending: true,
                description: desc,
                task: text
            };
            console.log("Cooked Value", todoItem);
            setTodos((curr) => ([...curr, todoItem]));
            setText("");
            setErr(false);
            setDesc("");
            updateLocalStorage(todoItem);
            return;
        };
    };

    const handleDelete = (data) => {
        setTodos((curr) => ([...curr.filter(item => item.id !== data.id)]));
        data.deleted = true;
        data.pending = false;
        setDeleted((current) => ([...current, data]));
        updateLocalStorage(data);
    };

    const handleDone = (data) => {
        setTodos((curr) => ([...curr.filter(item => item.id !== data.id)]));
        data.completed = true;
        data.pending = false;
        setCompletedTodos((curr) => ([...curr, data]));
        updateLocalStorage(data);
    };

    const deleteTodo = (data) => {
        setDeleted((curr) => ([...curr.filter((item) => data.id !== item.id)]));
        updateLocalStorage(data);
    };

    const updateLocalStorage = (data) => {
        if (saveSession) {
            console.log("saving");
            const userData = {
                todos: todos, completedTodos: completedTodos, deleted: deleted
            };
            console.log("userDataTosave Locally", userData);
            localStorage.setItem("mza-TodoApp", JSON.stringify(userData));
            console.log("saved DATA");
            return true;
        } else {
            console.log("unSaved Data user not ticked");
            return false;
        };
    };

    useEffect(() => {
        let data = localStorage.getItem("mza-TodoApp");
        if (data !== null || undefined) {
            data = JSON.parse(data);
            setTodos(data.todos);
            setDeleted(data.deleted);
            setCompletedTodos(data.completedTodos);
            return;
        };
    }, []);

    return (
        <div className="home">
            <div className='card'>
                {todos.length !== 0 &&
                    <div className='leftWrapper'>
                        <h2>To Do</h2>
                        <div className="todoContainer">
                            {todos?.map((todo, i) => (
                                <div className="todoItem" key={i}>
                                    {todo.task.substring(0, 18)}
                                    <div className='doneBtn' onClick={e => handleDone(todo)}>
                                        <i className="bi bi-list-check"></i>
                                    </div>
                                    <div className="deleteBtn" onClick={e => handleDelete(todo)}>
                                        <i className='bi bi-trash'></i>
                                    </div>
                                </div>
                            ))}
                            {deleted?.map((todo, i) => (
                                <div className={`doneItem ${"deleted"}`} key={i}>
                                    {todo.task.substring(0, 18)}
                                    <div className="deletedBtn" onClick={e => deleteTodo(todo)}>
                                        <i className="bi bi-file-earmark-x-fill"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <div className='card'>
                <div className="centerWrapper">
                    <div className="addData">
                        <h2>What's Up!</h2>
                        <p>It's <b>{today} {time}</b> & You're Here! <br />
                            How about creating a to do list!</p>
                        <input type="text" maxLength="50" name='todo' className={`textInput ${err ? "showErr" : ""}`} id='textInput'
                            onKeyPress={e => { if (e.key === "Enter") { setText(e.target.value); handleList() } }}
                            value={text} placeholder="Workout..."
                            onChange={e => setText(e.target.value)} />
                        <div className='addBtn' onClick={handleList}><i className="bi bi-file-plus"></i></div>
                    </div>
                    <div className="section">
                        <p>Description</p>
                        <textarea placeholder='Go for shopping...' value={desc} onChange={e => setDesc(e.target.value)}
                            onKeyPress={e => { if (e.key === "Enter") { setDesc(e.target.value); handleList() } }} ></textarea>
                        {/* <iconify-icon icon="cil:truck" /> */}
                        <button onClick={e => { handleList(); setDesc(""); }}>Submit</button>
                    </div>
                    <div className='toggleBtn'>
                        <h5>Save Session </h5>
                        <iconify-icon onClick={e => setSaveSession(!saveSession)} style={{ color: `${saveSession ? "green" : "black"}` }}
                            icon={saveSession ? "foundation:checkbox" : "ic:twotone-check-box-outline-blank"} />
                        {/* <iconify-icon icon="bxs:checkbox" />  */}
                    </div>
                </div>
            </div>
            <div className='card'>
                {completedTodos.length !== 0 &&
                    <div className='rightWrapper'>
                        <h2>Completed</h2>
                        <div className="completedContainer">
                            {completedTodos?.map((todo, i) => (
                                <div className="doneItem" key={i}>
                                    {todo.task.substring(0, 18)}
                                    <div className='completeBtn' onClick={e => console.log(e)}>
                                        <i className="bi bi-check2-all"></i>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Home;