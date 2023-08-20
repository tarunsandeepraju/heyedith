document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const outputDiv = document.getElementById('output');
    const responseDiv = document.getElementById('response'); 
    const knowmorediv = document.getElementById("know");
    
    
    stopButton.style.display = 'none';
    const recognition = new webkitSpeechRecognition();
    stopButton.addEventListener('click',function(){
        startButton.style.display = 'inline';
        stopButton.style.display = 'none';
        recognition.stop(); //stops listening
        speechSynthesis.cancel() //stops speaking
        outputDiv.textContent=""
       
        
    })
    startButton.addEventListener('click',function(){
        stopButton.style.display = 'inline';
        startButton.style.display = 'none';
        recognition.start();
        outputDiv.textContent="Listening..."
        
    })
    let isListening = false;

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        const text = transcript.toLowerCase();
        outputDiv.textContent = 'You said: ' + transcript;

        hey_edith(text);
    };

    recognition.addEventListener('end', function() { 
        startButton.textContent = 'Start Listening';
        
    });
    
    startButton.addEventListener('click', function() {
        if (!isListening) {
            recognition.start();
            isListening = true;
        } else {
            recognition.stop();
            isListening = false;
        }
    });

    speechSynthesis.addEventListener('voiceschanged', function() {
        utterance.voice = speechSynthesis.getVoices()[0];
    });

    function talk(text) {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        utterance.voice = speechSynthesis.getVoices()[0];
        utterance.rate = 1;
        utterance.pitch = 1;


        if (text.includes("Playing")) {
            responseDiv.className = "response-green"; // Change to green for "Playing" responses
        } else {
            responseDiv.className = "response-blue"; // Default to blue for other responses
        }
        
        responseDiv.textContent = "Hey Edith: " + text;
        speechSynthesis.speak(utterance);
        utterance.onend = function() {
            startButton.style.display = 'inline';
            stopButton.style.display = 'none';
        };
    }

    function hey_edith(command) {
        const lowerCaseCommand = command.toLowerCase();
        
        
        if (lowerCaseCommand.includes('play')) {
            const song = command.replace('play', '').trim();
            talk('Playing ' + song);
            const url = "https://www.youtube.com/results?search_query=" + encodeURIComponent(song);
            window.open(url, '_blank');
        } else if (lowerCaseCommand.includes('channel')) {
            const formattedChannelName = lowerCaseCommand.replace(/\s+/g, '').replace('channel', '').trim();
            const url = `https://www.youtube.com/c/${formattedChannelName}`;
            talk("Opening " + formattedChannelName + " YouTube channel");
            window.open(url, '_blank');
        } else if (lowerCaseCommand.includes('weather')) {
            const weather = lowerCaseCommand.replace('weather', '').trim();
            talk("Here's what I found about weather");
            const url = "https://www.google.com/search?q=weather&rlz=1C1IBEF_enIN1038IN1038&oq=weather&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MgYIARBFGEAyBggCECMYJzISCAMQABgUGIMBGIcCGLEDGIAEMg0IBBAAGIMBGLEDGIAEMgYIBRBFGDwyBggGEEUYPDIGCAcQRRg80gEINDg0OGoxajeoAgCwAgA&sourceid=chrome&ie=UTF-8" + encodeURIComponent(weather);
            window.open(url, '_blank');
        } else if (lowerCaseCommand.includes("open")) {
            const urlInput = command.replace("open", "").trim();
            const url = "https://" + urlInput + ".com"
            talk("Opening " + urlInput);
            window.open(url, "_blank");
            console.log(url);
        } else if (lowerCaseCommand.includes("your name") || lowerCaseCommand.includes("hey") || lowerCaseCommand.includes('hi')||lowerCaseCommand.includes('hello')) {
            talk("Hi, My name is Hey Edith, your personal voice assistant. I'm here to help you.");
        } else if (lowerCaseCommand.includes("what is my name") || lowerCaseCommand.includes("my name")) {
            talk("Your name is Sandeep");
        } else if (lowerCaseCommand.includes("current date") || lowerCaseCommand.includes("today's date") || lowerCaseCommand.includes("what's the date today") || lowerCaseCommand.includes('date')) {
            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1;
            const year = currentDate.getFullYear();
            const formattedDate = `${month}/${day}/${year}`;
            talk("The current date is: " + formattedDate);
        } else if (lowerCaseCommand.includes("current time") || lowerCaseCommand.includes("what's the time now")) {
            const currentDate = new Date();
            const hours = currentDate.getHours();
            const minutes = currentDate.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedTime = `${formattedHours}:${minutes}${ampm}`;
            talk("The current time is: " + formattedTime);
        } 
        else if (lowerCaseCommand.includes("what") || lowerCaseCommand.includes("who") || lowerCaseCommand.includes("search") || lowerCaseCommand.includes("how")) {
            const wikipediaApiUrl = `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(command)}`;
        
            $.ajax({
                url: wikipediaApiUrl,
                method: "GET",
                dataType: "json",
                success: function (data) {
                    const searchResults = data.query.search;
                    if (searchResults.length > 0) {
                        const result = searchResults[0]; // Change to the desired result index
                        const resultHtml = result.snippet;
                        const pageId = result.pageid; // Get the page ID
        
                        // Clean the content by removing <span> elements with class "searchmatch"
                        const cleanedContent = resultHtml.replace(/<\/?span[^>]*>/g, '');
        
                        // Create a "Know More" link
                        const knowMoreLink = `<a href="https://en.wikipedia.org/?curid=${pageId}" target="_blank">Know More</a>`;
                        
    
                        // Combine cleaned content with "Know More" link
                        const contentWithLink = `Here is the information I found on Wikipedia. ${cleanedContent}`;
                
                        //knowmorediv.textContent("knowMoreLink")
                        knowmorediv.innerHTML = knowMoreLink;
        
                        // Display the information
                        talk(contentWithLink);
                    } else {
                        talk("I'm sorry, I couldn't find relevant information");
                    }
                },
                error: function (error) {
                    talk("Error fetching Wikipedia content:", "response-wikipedia");
                }
            });
        }
               
        
    
    }
});
