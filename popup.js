let currentDomain = null;
let predictedValue = null;
// console.log("page called");

chrome.tabs.query({ active: true, lastFocusedWindow: true }, async function (tabs) {
    // console.log("API called");
    const tab = tabs[0];
    const tabDomain = extractMainDomain(tab.url);
    currentDomain = tabDomain;
    // alert("call api")
    // alert(currentDomain);
    // console.log("API called");
    if (currentDomain != null){
        predictedValue = await fetchData(currentDomain);
        updatePopup(currentDomain, predictedValue);
    }

    chrome.tabs.sendMessage(tab.id, { greeting: "activateFeedback", prediction: predictedValue });
    // predictedValue = await fetchData(currentDomain);
    // updatePopup(currentDomain, predictedValue);
});


async function fetchData(currentDomain) {
    try {
        if (currentDomain != null){
            const dataToSend = {
                text: currentDomain
            };

            const response = await fetch('http://127.0.0.1:8000/URLWatcher/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const data = await response.json();
            predictedValue = data.predictions;
            return predictedValue;
        }

        } catch (error) {
            console.error(error);
            alert('An error occurred while fetching data');
        }
        
}

function updatePopup(domain, predictedValue ) {
    document.getElementById('domain').textContent = "Domain: " + domain;
    const popup_container = document.getElementById('popup_container');
    const predictedResultsDiv = document.getElementById('current-url');

    const urlInput = document.getElementById('url-input');

    website = predictedValue === 0 ? "Legitimate URL" : 'Malicious URL'
    

    if (predictedValue === 0){
        document.body.style.backgroundColor = "blue";
        popup_container.style.width = "300px";
        popup_container.style.padding = "20px";
        popup_container.style.border = "2px solid blue";
        popup_container.style.borderShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
        popup_container.style.borderRadius = "10px";
        predictedResultsDiv.style.color = "blue";
        

        // popup_container.style.backgroundColor = "green";
    }
    else{
        document.body.style.backgroundColor = "red";
        popup_container.style.border = "2px solid red";
        popup_container.style.borderRadius = "10px";
        popup_container.style.padding = "20px";
        popup_container.style.width = "300px";
        popup_container.style.borderShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)";
        predictedResultsDiv.style.color = "red";

        // popup_container.style.backgroundColor = "red";
        // document.body.style.backgroundColor = "green";
    }
    
    urlInput.value = domain;
    document.getElementById('current-url').textContent = website + " Domain";
    
    
}

function extractMainDomain(url) {
    console.log("API called");
    const matches = url.match(/^(https?:\/\/[^/]+)/i);
    if (matches !== null && matches.length > 1) {
        return matches[1];
    }
    return null;
}

const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');
const predictions = document.getElementById('predictions');

urlForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = urlInput.value;
  const response = await fetchData(url);
  updatePopup(url, response);
});




