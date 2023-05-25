const form = document.querySelector("form");
const formButton = document.querySelector("#formsubmit");

async function moveWishUp(wishId){

  try {
    //sender data som lager bruker
    const res = await fetch(`/wishes/${wishId}/move-up`,{
        method: 'post',
        headers: {'Content-Type': 'application/json'}
    })
    const pokoData = await res.json();
       
    // console.log(pokoData);
    location.reload();

} catch (err) {
    console.log(err)
    const message = await err.text();
    console.log('error message:', message);
}
}

async function formPOST(){
  const NAME = form.NAME.value
  const AUTHOR = form.AUTHOR.dataset.doc





  try {
    //sender data som lager bruker
    const res = await fetch('/account',{
        method: 'post',
        // body: formData,
        body: JSON.stringify({yourWish: NAME, author: AUTHOR}),
        headers: {'Content-Type': 'application/json'}
    })
    const pokoData = await res.json();
       
    // console.log(pokoData);
    location.reload();

} catch (err) {
    console.log(err)
    const message = await err.text();
    console.log('error message:', message);
}
}

form.addEventListener("keypress", async (e) => {
  if (e.key === "Enter" || e.submitter === formButton) {
    e.preventDefault();
    console.log("i am pressing enter");
      // Button was clicked, proceed with form submission
  
    formPOST();
 }

});

formButton.addEventListener("click", async (e) => {

  e.preventDefault();

  formPOST();

})

function deleteTRASH(arrayNr, author) {
  const endpoint = `/home/${arrayNr}`;
  console.log(endpoint);
  fetch(endpoint, {
    method: "DELETE",
    body: JSON.stringify({author: author}),
    headers: {'Content-Type': 'application/json'}
  })
  .then(() => {
    location.reload();
  })
  // .then(data => window.location.href = data.redirect)
  .catch(err => console.log(err));
}

  function fillForm(name, id) {
    // console.log(name, author, id);
  // Get references to the form fields
  const nameField = document.getElementById(`updateInput${id}`);

  const authorField = document.querySelector('input[name="AUTHOR"]');
  const updateIdInput = document.querySelector('input[name="UPDATEID"]');
  const button = document.getElementById(`update-form${id}`);


  // Set the values of the form fields to the corresponding pokomon data
  nameField.value = name;

  // authorField.value = author;
  updateIdInput.value = id;

  nameField.style.display = 'inline-block';
  button.style.display = 'inline-block';
}

async function updateForm(arrayNr, author) {
  const nameField = document.getElementById(`updateInput${arrayNr}`).value;

  const authorField = document.querySelector('input[name="AUTHOR"]').dataset.doc;
  // console.log(arrayNr);



  try {
    const res = await fetch(`/update/${arrayNr}`,{
        method: 'post',
        body: JSON.stringify({yourWish: nameField, author: author}),
        headers: {'Content-Type': 'application/json'}
    })
    location.reload();
} catch (err) {
console.log(err);
}
}

