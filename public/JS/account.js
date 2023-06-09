const form = document.querySelector("form");
const formButton = document.querySelector("#formsubmit");

function moveWishUp(userId, currentIndex, counter) {
  const wishContainer = document.getElementById(`wish-${counter}`);
  const prevWishContainer = document.getElementById(`wish-${counter - 1}`);
  const currentWish = wishContainer.innerHTML;
  const prevWish = prevWishContainer.innerHTML;

  // Swap the wish containers
  wishContainer.innerHTML = prevWish;
  prevWishContainer.innerHTML = currentWish;

  // Make a POST request to update the wish order on the server-side
  fetch(`/${userId}/move-wish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentIndex,
      newIndex: currentIndex - 1,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Wish moved up:', data);
    })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

function moveWishDown(userId, currentIndex, counter) {
  const wishContainer = document.getElementById(`wish-${counter}`);
  const nextWishContainer = document.getElementById(`wish-${++counter}`);
  console.log(wishContainer, nextWishContainer);
  const currentWish = wishContainer.innerHTML;
  const nextWish = nextWishContainer.innerHTML;

  // Swap the wish containers
  wishContainer.innerHTML = nextWish;
  nextWishContainer.innerHTML = currentWish;

  // Make a POST request to update the wish order on the server-side
  fetch(`/${userId}/move-wish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      currentIndex, newIndex: ++currentIndex}),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Wish moved down:', data);
    })
    .then(() => {
      location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}


async function formPOST(){
  const NAME = form.NAME.value
  const AUTHOR = form.AUTHOR.dataset.doc





  try {
    //sender data som lager bruker
    const res = await fetch('/account',{
        method: 'post',
        body: JSON.stringify({yourWish: NAME, author: AUTHOR}),
        headers: {'Content-Type': 'application/json'}
    })
    const pokoData = await res.json();
       
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
  .catch(err => console.log(err));
}

  function fillForm(name, id) {
  // Get references to the form fields
  const nameField = document.getElementById(`updateInput${id}`);

  const authorField = document.querySelector('input[name="AUTHOR"]');
  const updateIdInput = document.querySelector('input[name="UPDATEID"]');
  const button = document.getElementById(`update-form${id}`);


  // Set the values of the form fields to the corresponding pokomon data
  nameField.value = name;
  updateIdInput.value = id;

  nameField.style.display = 'inline-block';
  button.style.display = 'inline-block';
}

async function updateForm(arrayNr, author) {
  const nameField = document.getElementById(`updateInput${arrayNr}`).value;


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

