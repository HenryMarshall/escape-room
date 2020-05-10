let gameState = null

$(document).ready(function() {
  console.log("Let's get started")

  loadOrCreateGame()
  setVisibility()
  $("#restart").click(setupGame)
  $("#guess-password").submit(guessPassword)
  $("#inventory > button").click(clickItem)

  function loadOrCreateGame() {
    const storedGameState = sessionStorage.getItem('gameState')
    if (!!storedGameState) {
      console.log("Restoring an existing game state")
      gameState = JSON.parse(storedGameState)
    }
    else {
      setupGame()
    }
  }

  function setupGame() {
    console.log("Setting up a new game")
    const newGameState = {
      thingsFound: [],
    }
    gameState = Object.assign({}, newGameState)
    sessionStorage.setItem('gameState', JSON.stringify(newGameState))
    setVisibility()
  }

  function setVisibility() {
    $(".potentially-hidden").each(function() {
      const thisUrl = $(this).attr("data-url")
      const hiddenAtStart = $(this).attr("data-hidden-at-start") === 'true'
      const isFound = gameState.thingsFound.includes(thisUrl)

      if (!hiddenAtStart || isFound) {
        $(this).css('display', 'inline-block')
      }
      else {
        // Included to make resetting the game work
        $(this).css('display', 'none')
      }
    })
  }

  function findThing(thing) {
    gameState.thingsFound.push(thing)
    sessionStorage.setItem('gameState', JSON.stringify(gameState))
  }

  function guessPassword(event) {
    event.preventDefault()
    
    const correctPassword = exitCondition.password.toLowerCase()

    if (!correctPassword) {
      alert("Fatal Error: Missing `exit_condition.password`")
      return
    }

    const $password = $("#password")
    const guess = $password.val()
    if (guess.toLowerCase() === correctPassword) {
      redirectToSolution()
    }
    else {
      alert("Nope, try again")
      $password.val("")
    }
  }

  function clickItem(event) {
    const itemClicked = $(event.target).attr("data-item")
    const itemRequired = `${exitCondition.item}.html`

    if (itemClicked === itemRequired) {
      redirectToSolution()
    }
    else {
      alert("That didn't seem to do anything")
    }
  }

  function redirectToSolution() {
    const destination = exitCondition.destination

    if (!destination) {
      alert("Fatal Error: Missing `exit_condition.destination`")
      return
    }

    const url = `${destination}.html`
    findThing(url)
    window.location.replace(url)
  }
})