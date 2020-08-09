// procurar o botao
document.querySelector("#add-time")
//quando clicar no botao
.addEventListener('click',cloneField)


//executar uma ação
function cloneField(){
    //duplicar os campos
  const newFielsContainer = document.querySelector('.schedule-item').cloneNode(true)

  //pegar os campos
  const fields = newFielsContainer.querySelectorAll('input')

 fields.forEach((e)=>{
  e.value = ""
 })
    //colocar na pagina
    document.querySelector('#schedule-items').appendChild(newFielsContainer)
}
 