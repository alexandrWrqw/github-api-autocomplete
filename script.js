const input = document.querySelector('.search__input')
const autocompleteList = document.querySelector('.search__autocomplete')

const debounce = (fn, debounceTime) => {
	let timeout

	return function() {
		const fnCall = () => { fn.apply(this, arguments) }
    clearTimeout(timeout)
    timeout = setTimeout(fnCall, debounceTime)
	}
}

function createAutocompleteRepo(repoData) {
	const element = document.createElement('li')
	element.classList.add('search__repo-name')
	element.insertAdjacentHTML('afterbegin', repoData.name)
	autocompleteList.append(element)
}

async function searchRepo() {
	return await fetch(`https://api.github.com/search/repositories?q=${input.value}`).then(res => {
		if (res.ok) {
			res.json().then(res => {
				let amountRepo = 0
				
				for (const repo of res.items) {
					if (amountRepo < 5) createAutocompleteRepo(repo)
					amountRepo++
				}
			})
		} else {

		}
	})
}

const debouncedInputRes = debounce(() => {
	if (input.value !== '') {
		autocompleteList.innerHTML = ''
		searchRepo()
	} else {
		autocompleteList.innerHTML = ''
	}
}, 400)

input.addEventListener('keyup', debouncedInputRes)