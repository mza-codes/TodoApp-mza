import '../Components/DisplayItems.css';

const DisplayItems = ({ data }) => {
    console.log("props sent", data);
    return (
        <div className='page'>
            <h2 className='center'>Your Tasks</h2>
            <div className="dataContainer">
                {data?.map((todo) => (
                    <div id='data' key={todo.id}
                        className={todo.pending && !todo.deleted ? "pending" :
                            todo.completed ? "completed" :
                                todo.deleted ? "deletedCard" : "def"}>
                        <h4>{todo.task}</h4>
                        <p>{todo.pending && "Pending"}</p>
                        <p>{todo.completed && "Completed"}</p>
                        <p>{todo.deleted && "Deleted"}</p>
                        <p>{new Date(todo.id).toLocaleString()}</p>
                        <p>{todo.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DisplayItems;