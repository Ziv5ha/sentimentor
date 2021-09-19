const evaluateButton = document.getElementById("evaluate")
evaluateButton.addEventListener("click", evaluate)

function createElement(tagName, children = [], classes = [], attributes = {}) {   //creating a general DOM element
    let newElement = document.createElement(tagName)
    for (let child of children){
        if (typeof child === "string"){
            newElement.innerText = child
        }
        else {
            newElement.appendChild(child)
        }
    }
    for (let c of classes){
        newElement.classList.add(`${c}`)
    }
    for (let [att, value] of Object.entries(attributes)){
        newElement.setAttribute(`${att}`, `${value}`)
    }
    return newElement
}
function createResponceElement({result, sentences}, responseStatus){              //creating the main result element
    const polarity = createElement("p", [`${result.polarity}`], ["grade"])
    const type = createElement("p", [result.type], ["grade"])
    if (result.polarity>0){
        polarity.style = "color: green"
        type.style = "color: green"
    }
    if (result.polarity<0){
        polarity.style = "color: red"
        type.style = "color: red"
    }
    const text = createElement("p", [`"${sentences[0].sentence}"`])
    const catPic = httpCat(responseStatus)
    return createElement("div", [polarity, type, text, catPic], ["evaluated"])
}

const loader = document.getElementById("loading")                                 //operating the loader element
const dislpayLoader = () => {
    loader.classList.add("display")
    setTimeout(() => {
        loader.classList.remove("display")
    }, 5000)
}
const hideLoader = () => {
    loader.classList.remove("display")
}

function httpCat(status){                                                         //importing the cat memes. this is the most importat functions in the code.
    const previusCat = document.querySelector(".http-cat-img")
    if (previusCat){
        previusCat.parentElement.removeChild(previusCat)
    }
    const catPic = createElement("img", [], ["http-cat-img"], {src: `https://http.cat/${status}`})
    return catPic
    
}

async function evaluate(){
    dislpayLoader()
    const previusEvaluation = document.querySelector(".evaluated")
    if (previusEvaluation){
        previusEvaluation.parentElement.removeChild(previusEvaluation)
    }
    const inputText = document.getElementById("sentimantal-text").value
    const request = {
        method: "POST",
        headers:{
            Accept: "application/json", 
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            text: inputText
        })
    }
    try{
        const response = await fetch("https://sentim-api.herokuapp.com/api/v1/", request)
        const responseStatus = response.status
        if (!response.ok){
            const catPicElem = httpCat(responseStatus)
            document.body.appendChild(catPicElem)
            const error = `Failed! Error ${response.status} = ${response.statusText}`
            throw new Error (error)
        }
        const data = await response.json()
        const evaluetedTextElem = createResponceElement(data, responseStatus)
        document.body.appendChild(evaluetedTextElem)
        hideLoader()
    }
    catch(error){
        if (inputText === "") throw new Error ("Empty text")
        throw error
    }
}
