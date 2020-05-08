const autocompleteConfig={
  renderOption(movie){
    	   const imgSrc = movie.Poster==='N?A' ?'': movie.Poster;
    	   return `
        <img src="${imgSrc}">
         ${movie.Title} (${movie.Year})
	  	   `;

    },

    inputValue(movie){
    	return movie.Title;
    },
    async fetchData(searchTerm) {
    const response= await axios.get('http://www.omdbapi.com/',{
    	params:{
             apikey :'c1bac382',
             s:searchTerm
    }});
    
    if(response.data.Error){
    	  return [];
    }
    return response.data.Search;
} 


}

createAutoComplete({
	  ...autocompleteConfig,
    root: document.querySelector('#left-autocomplete'),
    onOptionSelect(movie){
    	  document.querySelector('.tutorial').classList.add('is-hidden');
    	  onmovieselect(movie, document.querySelector('#left-summary'),'left');
    }
    
});
createAutoComplete({
	  ...autocompleteConfig,
    root: document.querySelector('#right-autocomplete'),
    onOptionSelect(movie){
    	  document.querySelector('.tutorial').classList.add('is-hidden');
    	  onmovieselect(movie,document.querySelector('#right-summary','right'));
    }
});
let leftMovie;
let rightMovie;
const onmovieselect=async (movie,summaryElement, side) =>{
   const response = await axios.get('http://www.omdbapi.com/',{
    	params:{
             apikey :'c1bac382',
             i:movie.imdbID
    }});
    
   console.log(response.data);
    summaryElement.innerHTML=movieTemplate(response.data);
  if(side==='left'){
  	leftMovie= response.data;
  }
  else {
  	rightMovie= response.data;
  }
if(leftMovie && rightMovie){
	   runCompare(leftMovie, rightMovie);
} 

};
var leftCount=0,rightCount=0;
const runCompare =(leftMovie, rightMovie)=>{
	console.log("dejry");
  const leftSideStates= document.querySelectorAll('#left-summary .notification');
  const rightSideStates= document.querySelectorAll('#right-summary .notification');

  console.log('asassa',leftSideStates, rightSideStates);

   leftSideStates.forEach((leftStat, index)=>{
   	const rightStat= rightSideStates[index];
   
   const lsv= leftStat.dataset.value;
   const rsv= rightStat.dataset.value;
   if(rsv>lsv){
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-success');
      rightCount++;
         	
   }
   else{
   	leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-success');
   	  rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
      leftCount++;
   }
   });
   suggestion(rightCount, leftCount,leftMovie.Title, rightMovie.Title);
};

const movieTemplate = (movieDetail) => {

const dollars = parseInt(movieDetail.BoxOffice.replace(/\$/g,'').replace(/,/g,''));
const imdbRating= parseFloat(movieDetail.imdbRating);
const metascore= parseFloat(movieDetail.Metascore);
const imdbVotes= parseInt(movieDetail.imdbVotes.replace(/,/g,''));
let count=0;
const awards= movieDetail.Awards.split('').reduce((prev,word)=>{
	  const value = parseInt(word);
	  if(isNaN(value)){
	  	return prev;
	  }else{
	  	return prev+value;
	  }
    
}, 0);
console.log(awards);
console.log(dollars, metascore,imdbVotes);

   return `
       <article class='media'>
         <figure class='media-left'>
          <p class='image'>
           <img src="${movieDetail.Poster}" />
           </p>
          </figure>
          <div class='media-content' >
            <div class ="content">
              <h1>${movieDetail.Title}</h1>
              <h4>${movieDetail.Genre}</h4>
              <p> ${movieDetail.Plot}</p>
             </div>
            <div>
           </article>   
           <article data-value=${awards} class='notification is-primary'>
            <p class='title'> ${movieDetail.Awards}</p>
            <p class 'subtitle'> AWARDS </p>

           </article>
           <article data-value=${dollars} class='notification is-primary'>
            <p class='title'> ${movieDetail.BoxOffice}</p>
            <p class 'subtitle'> BoxOffice </p>

           </article> 
           <article data-value=${metascore} class='notification is-primary'>
            <p class='title'> ${movieDetail.Metascore}</p>
            <p class 'subtitle'> Metascore </p>
           </article>

           <article data-value=${imdbRating} class='notification is-primary'>
            <p class='title'> ${movieDetail.imdbRating}</p>
            <p class 'subtitle'> imdbRating</p>
           </article>
           <article data-value=${imdbVotes} class='notification is-primary'>
            <p class='title'> ${movieDetail.imdbVotes}</p>
            <p class 'subtitle'> imdbVotes</p>
           </article>
         
   `;
};
function suggestion (right,left, leftTitle,rightTitle){
	console.log('g khah', right, left, leftTitle,rightTitle);
	   let result= document.querySelector('#result');
	   
	   if(right>left){
	   	 result.innerHTML=`<h1> ${rightTitle} might be fun to watch </h1>`;
	   }
	   else if(left>right){
	   	 result.innerHTML=`<h1>  ${leftTitle} might be fun to watch </h1>`;
	   }
	   else{
	   	result.innerHTML=`<h1> Both Movies are great to watch </h1>`;
	   }
	   
}