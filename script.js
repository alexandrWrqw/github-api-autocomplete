// search and add repo in autocomplete
const input = document.querySelector('.search__input')
const repoList = document.querySelector('.search__repos')

const debounce = (fn, debounceTime) => {
	let timeout

	return function() {
		const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout)
    timeout = setTimeout(fnCall, debounceTime)
	}
}

async function repoRequest(repoName, perPageVal) {
  return await fetch(`https://api.github.com/search/repositories?q=${repoName}&per_page=${perPageVal}`)
}

function addRepoName(repoData) {
	const element = document.createElement('li')
	element.classList.add('search__repo-name')
	element.insertAdjacentHTML('afterbegin', repoData.name)
	repoList.append(element)
}

async function createRepoList() {
  repoRequest(input.value, 5)
  .then(res => {
    if (res.ok) {
      res
      .json()
      .then(res => {
        for (const repo of res.items) {
          addRepoName(repo)
        }
      })
    }
  })
}

function clearRepoList() {
  repoList.innerHTML = ''
}

function searchRepo() {
  if (input.value.trim() === '') return clearRepoList()

  clearRepoList()
  createRepoList()
}

const debouncedSearch = debounce(searchRepo, 400)

input.addEventListener('keyup', debouncedSearch)

// ----------------------------------------------------------------------------------
// autocomplete click --> add selected repo
const selectedRepoList = document.querySelector('.search__selected')

function addSelectedRepo(repoData) {
  const element = document.createElement('li')
  element.classList.add('search__repo-selected')
  element.insertAdjacentHTML('afterbegin', 
  `Name: ${repoData.name}<br> Owner: ${repoData.owner.login}<br> Stars: ${repoData.stargazers_count}`)

  const deleteElementBtn = document.createElement('button')
  deleteElementBtn.classList.add('search__delete-btn')
  
  selectedRepoList.append(element)
  element.append(deleteElementBtn)
}

async function createSelectedRepo(repoName) {
  repoRequest(repoName, 1)
  .then(res => {
    if (res.ok) {
      res
      .json()
      .then(res => addSelectedRepo(res.items[0]))
    }
  })
}

repoList.addEventListener('click', function(e) {
  createSelectedRepo(e.target.textContent)
  clearRepoList()
  input.value = ''
})

// ----------------------------------------------------------------------------------
// click --> remove selected repo
selectedRepoList.addEventListener('click', function(e) {
  e.preventDefault()
  const target = e.target

  if (target.tagName === 'BUTTON') {
    target.closest('.search__repo-selected').remove()
  }
})