pragma solidity ^0.5.0;

contract TodoList{

    //number of items in todolist
    //state variable - persistent on blockchain
    uint public taskCount = 0;
    
    // model a task in solidity. 
    //Solidity allows to define your own data types with structs.
    struct Task {
    uint id;
    string content;
    bool completed;
    }

    //store the list of tasks on blockchain
    //tasks - state variable
    //use s special solidity data structure called a mapping to access data
    mapping(uint => Task) public tasks;

    event TaskCreated(
    uint id,
    string content,
    bool completed
    );

    event TaskCompleted(
    uint id,
    bool completed
    );

    //contructor function, initialise first item on tasklist
    constructor() public{
        //calling the createTask function
        //arg - string
        createTask("Initialise First task");
    }

    //function for creating tasks
    function createTask(string memory _content) public{
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }

}