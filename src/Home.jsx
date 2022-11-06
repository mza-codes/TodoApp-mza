import { useEffect, useState } from 'react';
import './App.css';
import { timeGreeting } from './Utils/TimeUtils';
import './Components/leftSection.css';
import './Components/rightSection.css';
import './Components/centerSection.css';
function Home() {
    const today = new Date().toLocaleString("en-IN", { weekday: "long", });
    const [err, setErr] = useState(false);
    const time = timeGreeting[new Date().getHours()];
    const [text, setText] = useState("");
    const [desc, setDesc] = useState("");
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [deleted, setDeleted] = useState([]);
    const [userTodos, setUserTodos] = useState([]);

    console.log('USERTODOS', userTodos);

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
            // localStorage.setItem("mza-TodoApp", JSON.stringify(todos));
            return;
        };
    };

    const handleDelete = (data) => {
        setTodos((curr) => ([...curr.filter(item => item.id !== data.id)]));
        data.deleted = true;
        data.pending = false;
        setDeleted((current) => ([...current, data]));
    };

    const handleDone = (data) => {
        setTodos((curr) => ([...curr.filter(item => item.id !== data.id)]));
        data.completed = true;
        data.pending = false;
        setCompletedTodos((curr) => ([...curr, data]));
    };

    useEffect(() => {
        const data = localStorage.getItem("mza-TodoApp");
        if (data !== null || undefined) {
            setTodos(JSON.parse(data));
        };
    }, []);

    // useEffect(() => {

    // }, []);

    window.onbeforeunload = () => {
        console.log("saving");
        const userData = {
            todos: todos, completedTodos: completedTodos, deleted: deleted
        };
        setUserTodos((current) => ([...current, userData]));
        localStorage.setItem("mza-TodoApp", JSON.stringify(userData));
        console.log("saved DATA");
        return "Session will be lost";
    };

    useEffect(() => {
        console.log('SETTING TO USER ARRAY');

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
                                    <div className="deletedBtn" onClick={e => console.log(e)}>
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
                        <p>It's {today} {time} & You're still Up! <br />
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