import { people,recipes,poem } from './data.js';

 function List() {
  const listItems = people.map(person =>
    <li key={person.id}>
      <p>
        <b>{person.name}:</b>
        {' ' + person.profession + ' '}
        因{person.accomplishment}而闻名世界
      </p>
    </li>

  
  );
  const mathList = people.filter(person => person.profession ==='数学家')
  const chemistList = people.filter(person => person.profession ==='化学家')
  const chemist = chemistList.map(chemistList =>
    <li key={chemistList.id}>
      <p>
        <b>{chemistList.name}:</b>
        {' ' + chemistList.profession + ' '}
        因{chemistList.accomplishment}而闻名世界
      </p>
    </li>
  )
  const math = mathList.map(mathList =>
    <li key={mathList.id}>
      <p>
        <b>{mathList.name}:</b>
        {' ' + mathList.profession + ' '}
        因{mathList.accomplishment}而闻名世界
      </p>
    </li>
  )
  return (
    <article>
      <h1>数学家</h1>
      <ul>{math}</ul>
      <h1>化学家</h1>
      <ul>{chemist}</ul>
    </article>
  );
}


function getRecipesList(id){
 const list = recipes.filter(item =>item.id === id)
 console.log('id:',id,'list:',list)
 const recipeslist = list.map(item =>
<li>
{item.ingredients}
</li>
    
 )
 console.log(recipeslist)
return (
  recipeslist
)
}

function recipesList(){
 
  const name = recipes.map(item => 
    
    <div key = {item.id}>
  <h2>
      {item.name}
    </h2>
    <ul>
      {
        item.ingredients.map(food => 
          <li key={food}>
            {food}
          </li>
        )
      }
    </ul>
    </div>
  )
  return(
    <>
    <h1>
      菜谱
    </h1>
    {name}
    </>
  )
}
function Poem() {
  return (
    <article>
      {poem.lines.map((line, index) =>
        <p key={index}>
          {line}
        </p>
      )}
    </article>
  );
}


export default Poem