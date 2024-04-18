document.addEventListener('DOMContentLoaded', function(){
    //defaults
    const player1 = {
        score: 0,
        display: document.getElementById('playerOneScore'),
        button: document.getElementById('playerOne')
    }

    const player2 = {
        score: 0,
        display: document.getElementById('playerTwoScore'),
        button: document.getElementById('playerTwo')
    }

    const images = {
        defaultPic: 'https://images.unsplash.com/photo-1624936188350-883a61a44116?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        scorePic: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGNwNXh0YzRiM3FqMzJ1eXp6Mzgzemw3bHp3dmd3aG51NnBtcnViMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4wnrJ7cWFluAZVkHBU/giphy.gif',
        tiePic: 'https://media1.tenor.com/m/Hbm5ksVowZsAAAAC/referee-%E5%B9%B3%E6%89%8B.gif',
        winPic: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWVmd3Rkb3drbWVmbXg1aDlyMGpjY3dveHQ4aXA4MTJscHM0enltMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qPgTAqlWVFWwtnwOyF/giphy.gif',
        oneMorePic: 'https://y.yarn.co/baa4ad45-6fa2-43b3-a560-728030191415_text.gif',
        twoMorePic: 'https://media1.tenor.com/m/Na51d6wtvtsAAAAC/can-i-get-two-more-please-i-want-more.gif'
    }

    const resetButton = document.getElementById('reset');
    const scoreLimitButton = document.getElementById('scoreLimit');
    const loadingScreen = document.getElementById('loading');
    const loadingScreenText = document.getElementById('loadingText');
    const thumbnailElement = document.getElementById('thumbnail');
    const hideOption = document.getElementById('hideOption');

    const jsConfetti = new JSConfetti();

    let scoreLimit = null;
    let oneMoreRound = null;
    let prevScorer = null;

    player1.button.disabled = true;
    player2.button.disabled = true;
    resetButton.disabled = true;
    hideOption.style.display = 'none';

    //loading screen
    function preloadImages(images, callback) {
        let loadedCount = 0;
        let totalCount = Object.keys(images).length;
        loadingScreenText.innerText = `Loaded ${loadedCount} out of ${totalCount}`;
        
        for (let key in images) {
            if (images.hasOwnProperty(key)) {
                let img = new Image();
                img.onload = function() {
                    loadedCount++;
                    loadingScreenText.innerText = `Loaded ${loadedCount} out of ${totalCount}`;
                    if (loadedCount === totalCount) {
                        loadingScreenText.innerText = 'Done!'
                        callback();
                    }
                };
                img.src = images[key];
            }
        }
    }

    function addDelay() {
        setTimeout(function() {
            console.log("All images preloaded, delay completed!");
            loadingScreen.remove();
        }, 1000);
    }
    preloadImages(images, addDelay);

    //drop down
    scoreLimitButton.addEventListener('change', function(event){
        player1.button.disabled = false;
        player2.button.disabled = false;
        resetButton.disabled = false;
        scoreLimit = parseInt(event.target.value);
    });
    
    //buttons
    player1.button.addEventListener('click', function(){
        scoreAdding(player1, player2);
    });

    player2.button.addEventListener('click', function(){
        scoreAdding(player2, player1);
    });

    resetButton.addEventListener('click', function(){
        for(let p of [player1, player2]){
            p.display.innerText = 0;
            p.button.disabled = true;
            p.score = 0;
            p.display.classList.remove('has-text-primary', 'has-text-danger');
        }
        scoreLimitButton.disabled = false;
        scoreLimitButton.value = 0;
        resetButton.disabled = true;
        thumbnailElement.src = images.defaultPic;
        scoreLimit = null;
        oneMoreRound = 0;
    })

    //score keeping
    function scoreAdding(player, opponent){
        player.score += 1;
        player.display.innerText = player.score;
        if(oneMoreRound > 0){
            if(prevScorer === player.display.id){    
                endGame(player, opponent);
            }else{
                scoreLimit += 1;
                prevScorer = player.display.id;
                thumbnailElement.src = images.oneMorePic;
            }
        }else if(player.score === opponent.score && opponent.score !== (scoreLimit - 1)){
            thumbnailElement.src = images.tiePic;
        }else if(player.score === scoreLimit){
            endGame(player, opponent);
        }else if(player.score == (scoreLimit - 1) && opponent.score == (scoreLimit - 1)){
            oneMoreRound += 1;
            scoreLimit += 1;
            prevScorer = player.display.id;
            thumbnailElement.src = images.twoMorePic;
        }else{
            scoreLimitButton.disabled = true;
            thumbnailElement.src = images.scorePic
        }
    };

    function endGame(player, opponent){
        for(let p of [player, opponent]){
            p.button.disabled = true;
            p.score = 0;
        }
        jsConfetti.addConfetti();
        player.display.classList.add('has-text-primary');
        opponent.display.classList.add('has-text-danger');
        thumbnailElement.src = images.winPic;
        scoreLimit = null;
        oneMoreRound = 0;
    }
    //score adding end
});
