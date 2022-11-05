import { useEffect, useState } from 'react';
import './App.css';
import { timeGreeting } from './Utils/TimeUtils';
import './Components/leftSection.css';
import './Components/rightSection.css';
function Home() {
    const today = new Date().toLocaleString("en-IN", { weekday: "long", });
    const [err, setErr] = useState(false);
    const time = timeGreeting[new Date().getHours()];
    const [text, setText] = useState("");
    const [todos, setTodos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [deleted, setDeleted] = useState([]);

    const regEx = /^[a-zA-Z][a-zA-Z ]*$/;

    const handleList = (value) => {
        let stat = regEx.test(text);
        if (!stat) {
            setErr(true);
            return;
        } else {
            setTodos((curr) => ([...curr, text]));
            setText("");
            setErr(false);
            // localStorage.setItem("mza-TodoApp", JSON.stringify(todos));
            return;
        };
    };

    const handleDelete = (data) => {
        setTodos((curr) => ([...curr.filter(item => item !== data)]));
        setDeleted((current) => ([...current, data]));
    };

    const handleDone = (data) => {
        setTodos((curr) => ([...curr.filter(item => item !== data)]));
        setCompletedTodos((curr) => ([...curr, data]));
    };

    useEffect(() => {
        const data = localStorage.getItem("mza-TodoApp");
        if (data !== null || undefined) {
            setTodos(JSON.parse(data));
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
                                    {todo.substring(0, 18)}
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
                                    {todo.substring(0, 18)}
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

            </div>
            <div className='card'>
                {completedTodos.length !== 0 &&
                    <div className='rightWrapper'>
                        <h2>Completed</h2>
                        <div className="completedContainer">
                            {completedTodos?.map((todo, i) => (
                                <div className="doneItem" key={i}>
                                    {todo.substring(0, 18)}
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