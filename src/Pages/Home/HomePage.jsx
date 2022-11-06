import { useEffect, useReducer, useState } from 'react';
import { timeGreeting } from '../../Utils/TimeUtils';
import '../../Components/leftSection.css';
import '../../Components/rightSection.css';
import '../../Components/centerSection.css';
import { todoReducer, todoState } from '../../Reducer/todoReducer';

function HomePage() {
    const today = new Date().toLocaleString("en-IN", { weekday: "long", });
    const time = timeGreeting[new Date().getHours()];
    const [err, setErr] = useState(false);
    const [text, setText] = useState("");
    const [desc, setDesc] = useState("");
    const [saveSession, setSaveSession] = useState(true);
    const [state, dispatch] = useReducer(todoReducer, todoState);
    const regEx = /^[a-zA-Z][a-zA-Z ]*$/;
    let isCompleted = false;
    let isPending = false;

    if (state.data.length >= 1) {
        console.log(state.data.length);
        isCompleted = state.data.filter(item => item.completed === true).length >= 1;
        isPending = state.data.filter(item => item.pending === true || item.deleted === true).length >= 1;
    };

    const handleList = async (value) => {
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
            dispatch({ type: "ADD_TASK", payload: todoItem });
            setText("");
            setErr(false);
            setDesc("");
            return;
        };
    };

    const handleDelete = async (data) => {
        const updated = state.data.filter(item => item.id !== data.id);
        data.deleted = true;
        updated.push(data);
        dispatch({ type: "UPDATE_TASK", payload: updated });
        return;
    };

    const handleDone = async (data) => {
        const updated = state.data.filter(item => item.id !== data.id);
        data.completed = true;
        data.pending = false;
        updated.push(data);
        dispatch({ type: "UPDATE_TASK", payload: updated });
        return;
    };

    const deleteTodo = async (data) => {
        const updated = state.data.filter((item) => item.id !== data.id);
        dispatch({ type: "UPDATE_TASK", payload: updated });
        return;
    };

    const undoDelete = async (data) => {
        dispatch({ type: "UNDO_DELETE", payload: data });
        return;
    };

    const updateLocalStorage = () => {
        if (saveSession) {
            console.log("saving", state.data);
            const values = state.data;
            localStorage.setItem("mza-TodoApp", JSON.stringify(values));
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
            dispatch({ type: "UPDATE_TASK", payload: data });
            return;
        };
    }, []);

    useEffect(() => {
        console.log("state changed");
        updateLocalStorage();
    }, [state]);

    return (
        <div className="home">
            <div className='card'>
                {isPending &&
                    <div className='leftWrapper'>
                        <h2>To Do</h2>
                        <div className="todoContainer">
                            {state?.data?.map((todo, i) => {
                                if (todo.pending && !todo.deleted) return (
                                    <div className="todoItem" key={i}>
                                        {todo.task.substring(0, 18)}
                                        <div className='doneBtn' onClick={e => handleDone(todo)}>
                                            <i className="bi bi-list-check"></i>
                                        </div>
                                        <div className="deleteBtn" onClick={e => handleDelete(todo)}>
                                            <i className='bi bi-trash'></i>
                                        </div>
                                    </div>
                                ); else if (todo.deleted && todo.pending) return (
                                    <div className={`doneItem ${"deleted"}`} key={i}>
                                        {todo.task.substring(0, 18)}
                                        <div className="deletedBtn" onClick={e => deleteTodo(todo)}>
                                            <iconify-icon icon="ep:remove-filled" />
                                        </div>
                                        <div className="undoBtn" onClick={e => undoDelete(todo)}>
                                            <iconify-icon icon="dashicons:undo" />
                                        </div>
                                    </div>
                                ); else return false;
                            })}
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
                        <iconify-icon onClick={e => setSaveSession(!saveSession)}
                            style={{ color: `${saveSession ? "green" : "black"}` }}
                            icon={saveSession ? "foundation:checkbox" : "ic:twotone-check-box-outline-blank"}
                        />
                    </div>
                </div>
            </div>
            <div className='card'>
                {isCompleted &&
                    <div className='rightWrapper'>
                        <h2>Completed</h2>
                        <div className="completedContainer">
                            {state?.data?.map((todo, i) => {
                                if (todo.completed) return (
                                    <div className="doneItem" key={i}>
                                        {todo.task.substring(0, 18)}
                                        <div className='completeBtn' onClick={e => console.log(e)}>
                                            <i className="bi bi-check2-all"></i>
                                        </div>
                                    </div>
                                ); else if (todo.completed && todo.deleted) return (
                                    <div className="doneItem deleted" key={i}>
                                        {todo.task.substring(0, 18)}
                                        <div className="deletedBtn" onClick={e => deleteTodo(todo)}>
                                            <i className="bi bi-file-earmark-x-fill"></i>
                                        </div>
                                    </div>
                                ); else return false;
                            })}
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default HomePage;