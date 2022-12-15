App = {
    loading: false,
    contracts: {},

    load: async () => {
      //loadWeb3() JS allows client to talk to blockchain
      await App.loadWeb3()
      //load account
      await App.loadAccount()
      //load contract
      await App.loadContract()
      //display
      await App.render()
    },

    loadWeb3: async () => {

      if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
            web3 = new Web3(web3.currentProvider);
            //console.log(web3.eth.accounts[0]);  
      } else {
        window.alert("Please connect to Metamask.")
      }
      // Modern dapp browsers...
      if (window.ethereum) {
        window.web3 = new Web3(ethereum)
        try {
          // Request account access if needed
          await ethereum.enable()
          // Acccounts now exposed
          web3.eth.sendTransaction({/* ... */})
        } catch (error) {
          // User denied account access...
        }
      }
    // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = web3.currentProvider
        window.web3 = new Web3(web3.currentProvider)
        // Acccounts always exposed
        web3.eth.sendTransaction({/* ... */})
      }
      // Non-dapp browsers...
      else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    },

    //web3.eth.accounts[0] - meaning first account on ganache
    loadAccount: async () => {
      // Set the current blockchain account
      App.account = web3.eth.accounts[0]
      //web3.eth.defaultAccount=web3.eth.accounts[0]
    },
    
    loadContract: async () => {
      // Create a JavaScript version of the smart contract
      const todoList = await $.getJSON('TodoList.json')
      App.contracts.TodoList = TruffleContract(todoList)
      App.contracts.TodoList.setProvider(App.web3Provider)
      // Hydrate the smart contract with values from the blockchain
      App.todoList = await App.contracts.TodoList.deployed()
      //console.log(todoList)
      //console.log(App.todoList)      
    },

    render: async () => {
      // Prevent double render
      if (App.loading) {
        return
      }

     // Update app loading state
      App.setLoading(true)
      
      // Render Account
      $('#account').html(App.account)
            
      // Render Tasks
      await App.renderTasks()
      //window.alert("After Task rendered")    

      // Update loading state
      App.setLoading(false)
    },
  
    renderTasks: async () => {
       
      // Load the total task count from the blockchain
      const taskCount = await App.todoList.taskCount()
      //console.log(taskCount)
      //window.alert(taskCount)

      //refering to id tasktemplate in html
      const $taskTemplate = $('.taskTemplate')
         
      // Render out each task with a new task template
      for (var i = 1; i <= taskCount; i++) {
        
        // Fetch the task data from the blockchain
        const task = await App.todoList.tasks(i)
        //window.alert(task)
        const taskId = task[0].toNumber()
        //window.alert(taskId)
        const taskContent = task[1]
        //window.alert(taskContent)
        const taskCompleted = task[2]
        //window.alert(taskCompleted)

        // Create the html for the task
        const $newTaskTemplate = $taskTemplate.clone()

        //.content refering to class=content
        //input refering to input type
        $newTaskTemplate.find('.content').html(taskContent)
        $newTaskTemplate.find('input')
                        .prop('name', taskId)
                        .prop('checked', taskCompleted)
                        .on('click', App.toggleCompleted)
                
        // Put the task in the correct list
        
        
        if (taskCompleted) {
          $('#completedTaskList').append($newTaskTemplate)
          //window.alert("taskcom true")
        } else {
          $('#taskList').append($newTaskTemplate)
          //window.alert("taskcom false")
        }
        // Show the task
        $newTaskTemplate.show()
        
      }
    },

    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content, {from: App.account})
        window.location. reload()
    },

    toggleCompleted: async (e) => {
        App.setLoading(true)
        const taskId = e.target.name
        await App.todoList.toggleCompleted(taskId, {from: App.account})
        window.location.reload()
    },


    setLoading: (boolean) => {
      //window.alert(boolean)
      App.loading = boolean
      const loader = $('#loader');
      const content = $('#content');
      if (boolean) {
        loader.show()
        content.hide()
      } else {
        loader.hide()
        content.show()
      }
    },
  }
  $(() => {
    $(window).load(() => {
      App.load()
    })
  })