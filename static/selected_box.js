
// import anime from 'animejs/lib/anime.es.js';

document.addEventListener('DOMContentLoaded', function () {
    const sympList = document.getElementById('symp-list');
    const selectedList = document.getElementById('selected');
    const noSymptoms = document.getElementById('noele');
    const myForm = document.getElementById('predform');
    submitButton = document.getElementById('submit');

    const liElements = selectedList.querySelectorAll('li');
    var n = liElements.length;
    //console.log(n);

    const pred=[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    

    // const git = document.getElementById('0');
    // const valueAttribute = git.getAttribute('value');
    // console.log('Value attribute:', valueAttribute);


    sympList.addEventListener('click', function (event) {
        // Check if the clicked element is an <h2> inside an <li>
        if (event.target.tagName === 'H2' && event.target.parentElement.className === 'symptoms') {

            var lival = event.target.parentElement.getAttribute('value');
            //console.log('Value attribute:', lival);
            //if (selectedList.getAttribute('value', lival);)

            if(!(selectedList.querySelector(`li[value="${lival}"]`))){

                //console.log(selectedList.querySelector(`li[value="${lival}"]`))
                noSymptoms.textContent="No symptoms selected";
                //console.log('lival:', lival);
                //console.log('Selector:', `li[value="${lival}"]`);
                pred[lival]=1;
                //console.log(pred);
                //arr.push(lival);
                //console.log(arr);
                const symptomText = event.target.textContent;
                const newLi = document.createElement('li');
                newLi.textContent = symptomText;
                newLi.className = 'selected-symptoms';
                newLi.setAttribute('value', lival);

                selectedList.appendChild(newLi);
                n++;
                console.log(n);

                if (n > 0) {
                    noSymptoms.style.display = 'none';
                }
                else{
                    noSymptoms.style.display = 'inline-block';
                }

    }
    }


    });

    selectedList.addEventListener('click', function (event){

        if (event.target.tagName === 'LI' && event.target.className === 'selected-symptoms' ) {

            var sellival = event.target.getAttribute('value');
            //console.log('Selected symp value: ', sellival);
            pred[sellival]=0;
            //console.log(pred);
            //selectedList.removeChild(liElement);
            event.target.remove();
            n--;
            //console.log(n);

            if (n > 0) {
                noSymptoms.style.display = 'none';
            }
            else{
                noSymptoms.style.display = 'inline-block';
            }

        }
    });

    function checkAndSubmitForm() {

        disc=document.querySelector('.dis_container');
        disc.style.opacity=0;

        if (n > 0){
            // Using Fetch API to send the array to Flask server
            fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pred: pred }),
            })
            .then(res => {
                if(res.ok){
                    console.log('SUCCESS');
                }else{
                    console.log("Not Successful   ",res.status);
                }
                return res.json();
            })
            .then(data => {

                // console.log(data);
                document.getElementById('you').textContent = "You may have";
                document.querySelector('.dis_container').style.display='flex';

                for(let i = 0; i < data.length; i++){
                    document.querySelector(`#dis${i+1} .op`).textContent=data[i].disease;
                    document.querySelector(`#dis${i+1} .perc`).textContent=data[i].percentage+"%";
                    document.querySelector(`#dis${i+1} .det`).textContent=data[i].details;
                }
                
                anime({
                    targets: disc,
                    opacity: 1,
                    duration: 500, 
                    easing: 'easeInOutQuad' 
                });


            })
            .catch(error => {
                console.log('ERROR', error);
            });


        } else {
            noSymptoms.textContent="Please select atleast one symptom";
        }
    }

    submitButton.addEventListener('click', checkAndSubmitForm);


});

