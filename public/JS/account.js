const form = document.querySelector("form");
const formButton = document.querySelector("#formsubmit");

formButton.addEventListener("click", async (e) => {

  e.preventDefault();

  const formData = new FormData();

  //form image value
  formData.append("image", form.IMAGE.files[0]);

  //form values
  formData.append('name', form.NAME.value);
  formData.append('ability1', form.ABILITY1.value);
  formData.append('ability2', form.ABILITY2.value);
  formData.append('ability3', form.ABILITY3.value);
  formData.append('author', form.AUTHOR.dataset.doc); 
//   const NAME = form.NAME.value
//   const A1 = form.ABILITY1.value
//   const A2 = form.ABILITY2.value
//   const A3 = form.ABILITY3.value
//   const AUTHOR = form.AUTHOR.dataset.doc
//   const IMG = form.IMAGE.value
//   console.log(IMG);




  try {
    //sender data som lager bruker
    const res = await fetch('/account',{
        method: 'post',
        body: formData,
        // body: JSON.stringify({name: NAME, ability1: A1, ability2: A2, ability3: A3, author: AUTHOR, file: IMG}),
        headers: {},
    })
    const pokoData = await res.json();
       
    // console.log(pokoData);
    location.reload();

} catch (err) {
    console.log(err)
    const message = await err.text();
    console.log('error message:', message);
}

})

function deleteTRASH(id) {
  const endpoint = `/home/${id}`;
  console.log(endpoint);
  fetch(endpoint, {
    method: "DELETE",
  })
  .then(() => {
    location.reload();
  })
  // .then(data => window.location.href = data.redirect)
  .catch(err => console.log(err));
}

function fillForm(name, ability1, ability2, ability3, author, id) {
  // Get references to the form fields
  const nameField = document.querySelector('input[name="NAME"]');
  const ability1Field = document.querySelector('input[name="ABILITY1"]');
  const ability2Field = document.querySelector('input[name="ABILITY2"]');
  const ability3Field = document.querySelector('input[name="ABILITY3"]');
  const authorField = document.querySelector('input[name="AUTHOR"]');
  const updateIdInput = document.querySelector('input[name="UPDATEID"]');
  const button = document.getElementById('update-form');
  // const imageInput = document.querySelector('input[name="IMAGE"]');
  // const img = document.querySelector('.pokomon-image img');

  // Set the values of the form fields to the corresponding pokomon data
  nameField.value = name;
  ability1Field.value = ability1;
  ability2Field.value = ability2;
  ability3Field.value = ability3;
  authorField.value = author;
  updateIdInput.value = id;


  button.style.display = 'inline-block';
}

async function updateForm() {
  const nameField = document.querySelector('input[name="NAME"]').value;
  const ability1Field = document.querySelector('input[name="ABILITY1"]').value;
  const ability2Field = document.querySelector('input[name="ABILITY2"]').value;
  const ability3Field = document.querySelector('input[name="ABILITY3"]').value;
  const authorField = document.querySelector('input[name="AUTHOR"]').value;
  let updateId = document.querySelector('input[name="UPDATEID"]').value;

  const formData = new FormData();

  //form image value
  formData.append("image", form.IMAGE.files[0]);

  //form values
  formData.append('name', nameField);
  formData.append('ability1', ability1Field);
  formData.append('ability2', ability2Field);
  formData.append('ability3', ability3Field);
  formData.append('author', authorField);

  try {
    const res = await fetch(`/update/${updateId}`,{
        method: 'post',
        body: formData,
        headers: {}
    })
    location.reload();
} catch (err) {
console.log(err);
}
}