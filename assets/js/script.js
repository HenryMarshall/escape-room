let gameState = null

$(document).ready(function() {
  console.log("Let's get started")

  loadOrCreateGame()
  $("#restart").click(function() {
    setupGame()
    location.reload()
  })
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
    setVisibility()
    console.log(gameState)
  }

  function setupGame() {
    console.log("Setting up a new game")
    const newGameState = {
      thingsFound: [],
    }
    gameState = Object.assign({}, newGameState)
    sessionStorage.setItem('gameState', JSON.stringify(newGameState))
  }

  function setVisibility() {
    $(".potentially-hidden").each(function() {
      const visibleIfUnlocked = $(this).attr("data-visible-if-unlocked")
      const isFound = gameState.thingsFound.includes(visibleIfUnlocked)

      if (!visibleIfUnlocked || isFound) {
        $(this).css('display', 'inline-block')
      }
      else {
        // Included to make resetting the game work
        $(this).css('display', 'none')
      }
    })
  }

  function findThing() {
    const thing = exitCondition.unlocks

    if (!thing) {
      alert("Fatal Error: Missing `exitCondition.unlocks`")
    }

    if (gameState.thingsFound.includes(thing)) {
      alert("You already found that thing")
    }
    else {
      gameState.thingsFound.push(thing)
      sessionStorage.setItem('gameState', JSON.stringify(gameState))
    }
  }

  function guessPassword(event) {
    event.preventDefault()
    
    const correctPassword = exitCondition.password.toLowerCase()

    if (!correctPassword) {
      alert("Fatal Error: Missing `exitCondition.password`")
      return
    }

    const $password = $("#password")
    const guess = $password.val()
    if (guess.toLowerCase() === correctPassword) {
      findThing()
      redirectToSolution()
    }
    else {
      alert("Nope, try again")
      $password.val("")
    }
  }

  function clickItem(event) {
    const itemClicked = $(event.target).attr("data-id")

    if (typeof exitCondition === 'undefined') {
      alert("That didn't seem to do anything")
    }
    else {
      const itemRequired = exitCondition.item
      if (itemClicked === itemRequired) {
        findThing()
        redirectToSolution()
      }
      else {
        alert("That didn't seem to do anything")
      }
    }
  }

  function redirectToSolution() {
    const destination = exitCondition.destination || `./${exitCondition.unlocks}.html`
    window.location.replace(destination)
  }
})